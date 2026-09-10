import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { fetchChatMessages, sendChatMessage, fetchEmergencyDetails } from '../services/emergencyService';
import { AIMessage, EmergencyRequest } from '../types';

export const TriageChatScreen = ({ route, navigation }: any) => {
  const { emergencyId } = route.params;
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [emergency, setEmergency] = useState<EmergencyRequest | null>(null);

  useEffect(() => {
    loadChatData();
  }, [emergencyId]);

  const loadChatData = async () => {
    const details = await fetchEmergencyDetails(emergencyId);
    setEmergency(details);
    const msgs = await fetchChatMessages(emergencyId);
    setMessages(msgs);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setInputText('');
    const updatedMsgs = await sendChatMessage(emergencyId, text);
    setMessages([...updatedMsgs]);
  };

  const renderMessageItem = ({ item }: { item: AIMessage }) => {
    const isAI = item.sender === 'ai';
    return (
      <View style={[styles.msgWrapper, isAI ? styles.aiWrapper : styles.userWrapper]}>
        <View style={[styles.msgBubble, isAI ? styles.aiBubble : styles.userBubble]}>
          <Text style={styles.senderLabel}>{isAI ? '🤖 AI Triage Assistant' : 'You'}</Text>
          <Text style={styles.msgText}>{item.content}</Text>
        </View>

        {isAI && item.suggested_answers && item.suggested_answers.length > 0 && (
          <View style={styles.suggestionsContainer}>
            {item.suggested_answers.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => handleSend(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Banner / Status */}
      <View style={styles.topBanner}>
        <View style={styles.bannerInfo}>
          <Text style={styles.statusTitle}>Dispatch Status: Searching Ambulance</Text>
          <Text style={styles.complaintText}>Complaint: {emergency?.chief_complaint}</Text>
        </View>
        <TouchableOpacity
          style={styles.trackBtn}
          onPress={() => navigation.navigate('AmbulanceTracking', { emergencyId })}
        >
          <Text style={styles.trackBtnText}>🗺️ Track Ambulance</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.chatList}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your response or symptoms..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={() => handleSend()}>
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBanner: {
    backgroundColor: '#1E293B',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  bannerInfo: {
    flex: 1,
    marginRight: 8,
  },
  statusTitle: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 'bold',
  },
  complaintText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  trackBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  trackBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  chatList: {
    padding: 16,
  },
  msgWrapper: {
    marginBottom: 16,
  },
  aiWrapper: {
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  msgBubble: {
    maxWidth: '85%',
    borderRadius: 14,
    padding: 12,
  },
  aiBubble: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  userBubble: {
    backgroundColor: '#0284C7',
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 4,
  },
  msgText: {
    color: '#F8FAFC',
    fontSize: 15,
    lineHeight: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  suggestionChip: {
    backgroundColor: '#334155',
    borderColor: '#38BDF8',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 6,
    marginBottom: 6,
  },
  suggestionText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#334155',
    color: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 8,
  },
  sendBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
