import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
} from "firebase/firestore";

import { auth, db } from "./firebaseConfig.js";

const CONVERSATIONS_COLLECTION = "conversations";
const MESSAGES_SUBCOLLECTION = "messages";

function requireUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("You must be logged in to access messages.");
    }
    return user;
}

function normalizeString(value, fieldName) {
    if (!value?.trim()) {
        throw new Error(`${fieldName} is required.`);
    }
    return value.trim();
}

function normalizeParticipants(participants) {
    if (!Array.isArray(participants) || participants.length < 2) {
        throw new Error("Participants must be an array of at least two user IDs.");
    }
    if (!participants.every((item) => typeof item === "string" && item.trim())) {
        throw new Error("Participants must be an array of non-empty strings.");
    }
    return participants.map((item) => item.trim());
}

export async function createConversation({ participants, applicationId, employerName }) {
    const user = requireUser();

    const normalizedParticipants = normalizeParticipants(participants);

    if (!normalizedParticipants.includes(user.uid)) {
        throw new Error("You must be a participant in the conversation.");
    }

    const normalizedApplicationId = normalizeString(applicationId, "Application ID");
    const normalizedEmployerName = employerName?.trim() || "";

    const conversationData = {
        participants: normalizedParticipants,
        applicationId: normalizedApplicationId,
        employerName: normalizedEmployerName,
        lastMessage: "",
        updatedAt: serverTimestamp(),
    };

    const conversationRef = await addDoc(
        collection(db, CONVERSATIONS_COLLECTION),
        conversationData
    );

    return conversationRef.id;
}

export async function getOrCreateConversation({
    participants,
    applicationId,
    employerName,
}) {
    const normalizedApplicationId = normalizeString(applicationId, "Application ID");

    const q = query(
        collection(db, CONVERSATIONS_COLLECTION),
        where("applicationId", "==", normalizedApplicationId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
        return snapshot.docs[0].id;
    }

    return createConversation({ participants, applicationId: normalizedApplicationId, employerName });
}

export async function sendMessage(conversationId, text) {
    const user = requireUser();

    if (!conversationId?.trim()) {
        throw new Error("Conversation ID is required.");
    }

    const normalizedText = normalizeString(text, "Message text");

    const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId.trim());
    const conversationSnapshot = await getDoc(conversationRef);

    if (!conversationSnapshot.exists()) {
        throw new Error("Conversation not found.");
    }

    const conversationData = conversationSnapshot.data();
    if (!Array.isArray(conversationData.participants) || !conversationData.participants.includes(user.uid)) {
        throw new Error("You are not a participant in this conversation.");
    }

    const messageData = {
        senderId: user.uid,
        text: normalizedText,
        sentAt: serverTimestamp(),
    };

    const messageRef = await addDoc(
        collection(db, CONVERSATIONS_COLLECTION, conversationId.trim(), MESSAGES_SUBCOLLECTION),
        messageData
    );

    await updateDoc(conversationRef, {
        lastMessage: normalizedText,
        updatedAt: serverTimestamp(),
    });

    return messageRef.id;
}

export async function getMessages(conversationId) {
    if (!conversationId?.trim()) {
        throw new Error("Conversation ID is required.");
    }

    const q = query(
        collection(db, CONVERSATIONS_COLLECTION, conversationId.trim(), MESSAGES_SUBCOLLECTION),
        orderBy("sentAt", "asc")
    );

    const snapshot = await getDocs(q);

    const messages = [];
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        messages.push({
            id: docSnap.id,
            senderId: data.senderId,
            text: data.text,
            sentAt: data.sentAt,
        });
    });

    return messages;
}

export async function getConversations() {
    const user = requireUser();

    const q = query(
        collection(db, CONVERSATIONS_COLLECTION),
        where("participants", "array-contains", user.uid)
    );

    const snapshot = await getDocs(q);

    const conversations = [];
    snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        conversations.push({
            id: docSnap.id,
            participants: data.participants || [],
            applicationId: data.applicationId,
            employerName: data.employerName,
            lastMessage: data.lastMessage,
            updatedAt: data.updatedAt,
        });
    });

    conversations.sort((a, b) => {
        const aTime = a.updatedAt?.toMillis?.() ?? 0;
        const bTime = b.updatedAt?.toMillis?.() ?? 0;
        return bTime - aTime;
    });

    return conversations;
}

//Aliases for alternate naming conventions
export const fetchConversations = getConversations;
export const getUserConversations = getConversations;
export const listConversations = getConversations;

export const fetchMessages = getMessages;
export const getThread = getMessages;
export const getMessagesThread = getMessages;

export const startConversation = createConversation;
export const openConversation = createConversation;

export const send = sendMessage;

export default {
    createConversation,
    getOrCreateConversation,
    sendMessage,
    getMessages,
    getConversations,
    fetchConversations,
    getUserConversations,
    listConversations,
    fetchMessages,
    getThread,
    getMessagesThread,
    startConversation,
    openConversation,
    send,
};