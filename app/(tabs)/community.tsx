import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MessageCircle, ThumbsUp, Share2, Flag, Send } from "lucide-react-native";
import { COMMUNITY_POSTS } from "@/constants/communityPosts";

export default function CommunityScreen() {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [newComment, setNewComment] = useState("");
  const [activePost, setActivePost] = useState<number | null>(null);
  
  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.liked ? post.likes - 1 : post.likes + 1, liked: !post.liked } 
        : post
    ));
  };
  
  const handleComment = (postId: number) => {
    if (newComment.trim() === "") return;
    
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [
              ...post.comments, 
              { 
                id: post.comments.length + 1, 
                username: "Sen", 
                text: newComment, 
                time: "Şimdi" 
              }
            ] 
          } 
        : post
    ));
    
    setNewComment("");
    setActivePost(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Topluluk</Text>
          <Text style={styles.headerSubtitle}>
            Deneyimlerini paylaş, başkalarından ilham al
          </Text>
        </View>
        
        <View style={styles.featuredStory}>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }} 
            style={styles.featuredImage} 
          />
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>Başarı Hikayesi: Ahmet'in Yolculuğu</Text>
            <Text style={styles.featuredDescription}>
              "3 yıldır sigaradan uzak duruyorum. İlk başta çok zordu ama şimdi hayatımın en iyi kararı olduğunu düşünüyorum..."
            </Text>
            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>Devamını Oku</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.postsContainer}>
          <Text style={styles.sectionTitle}>Topluluk Paylaşımları</Text>
          
          {posts.map(post => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.userInfo}>
                  <View style={styles.userAvatar}>
                    <Text style={styles.userInitial}>{post.username.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={styles.username}>{post.username}</Text>
                    <Text style={styles.postTime}>{post.time}</Text>
                  </View>
                </View>
              </View>
              
              <Text style={styles.postContent}>{post.content}</Text>
              
              {post.image && (
                <Image source={{ uri: post.image }} style={styles.postImage} />
              )}
              
              <View style={styles.postStats}>
                <Text style={styles.statsText}>{post.likes} beğeni</Text>
                <Text style={styles.statsText}>{post.comments.length} yorum</Text>
              </View>
              
              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleLike(post.id)}
                >
                  <ThumbsUp size={20} color={post.liked ? "#4CAF50" : "#666"} />
                  <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
                    Beğen
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => setActivePost(activePost === post.id ? null : post.id)}
                >
                  <MessageCircle size={20} color="#666" />
                  <Text style={styles.actionText}>Yorum</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color="#666" />
                  <Text style={styles.actionText}>Paylaş</Text>
                </TouchableOpacity>
              </View>
              
              {post.comments.length > 0 && (
                <View style={styles.commentsContainer}>
                  {post.comments.slice(0, activePost === post.id ? undefined : 2).map(comment => (
                    <View key={comment.id} style={styles.commentItem}>
                      <View style={styles.commentAvatar}>
                        <Text style={styles.commentInitial}>{comment.username.charAt(0)}</Text>
                      </View>
                      <View style={styles.commentContent}>
                        <Text style={styles.commentUsername}>{comment.username}</Text>
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.commentTime}>{comment.time}</Text>
                      </View>
                    </View>
                  ))}
                  
                  {post.comments.length > 2 && activePost !== post.id && (
                    <TouchableOpacity 
                      style={styles.viewMoreComments}
                      onPress={() => setActivePost(post.id)}
                    >
                      <Text style={styles.viewMoreText}>
                        Tüm yorumları gör ({post.comments.length})
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {activePost === post.id && (
                <View style={styles.addCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Yorumunu yaz..."
                    value={newComment}
                    onChangeText={setNewComment}
                    multiline
                  />
                  <TouchableOpacity 
                    style={styles.sendButton}
                    onPress={() => handleComment(post.id)}
                  >
                    <Send size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
        
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Profesyonel Destek</Text>
          <Text style={styles.supportText}>
            Bağımlılıkla mücadelede profesyonel destek almak istersen, Yeşilay'ın YEDAM danışma hattını arayabilirsin.
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>Yeşilay'a Bağlan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  featuredStory: {
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featuredImage: {
    width: "100%",
    height: 150,
  },
  featuredContent: {
    padding: 15,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 14,
    color: "#444",
    marginBottom: 12,
  },
  readMoreButton: {
    alignSelf: "flex-start",
  },
  readMoreText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 20,
    marginBottom: 15,
  },
  postsContainer: {
    marginBottom: 20,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  userInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  username: {
    fontWeight: "bold",
    fontSize: 16,
  },
  postTime: {
    fontSize: 12,
    color: "#666",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  statsText: {
    fontSize: 14,
    color: "#666",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    marginLeft: 5,
    fontSize: 14,
    color: "#666",
  },
  actionTextActive: {
    color: "#4CAF50",
  },
  commentsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  commentInitial: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 10,
  },
  commentUsername: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  viewMoreComments: {
    paddingVertical: 8,
  },
  viewMoreText: {
    color: "#4CAF50",
    fontWeight: "500",
  },
  addCommentContainer: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "flex-end",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#4CAF50",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  supportSection: {
    backgroundColor: "#E8F5E9",
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2E7D32",
  },
  supportText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 15,
  },
  supportButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  supportButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});