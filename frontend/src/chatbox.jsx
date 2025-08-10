import { useUser } from "./contextprovider";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // ✅ Import useLocation
import { supabase } from "../supabaseClient";
import "./chatbox.css";

function ChatBox() {
  const senderEmail = useUser();
  const location = useLocation();    
  
  // ✅ Get receiverEmail from navigate state
  const receiverEmail = location.state?.receiverEmail || null;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch existing messages between sender & receiver
  const fetchMessages = async () => {
    if (!receiverEmail || !senderEmail) return;
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_email.eq.${senderEmail},receiver_email.eq.${receiverEmail}),and(sender_email.eq.${receiverEmail},receiver_email.eq.${senderEmail})`
      )
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error.message);
    } else {
      setMessages(data || []);
    }
  };

  // Send new message
  const sendMessage = async () => {
    if (!receiverEmail) {
      alert("No receiver specified.");
      return;
    }

    if (!newMessage.trim()) return;

    const { error } = await supabase.from("messages").insert([{
      sender_email: senderEmail,
      receiver_email: receiverEmail,
      content: newMessage,
    }]);
    if (error) {
      console.error("Error inserting message:", error.message);
    } else {
      setNewMessage("");
    }
  };

  useEffect(() => {
    if (!receiverEmail) {
      console.error("Receiver email is missing — check navigate state.");
      return;
    }

    fetchMessages();

    const channel = supabase
      .channel(`private-chat-${senderEmail}-${receiverEmail}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const message = payload.new;
          const isRelevant =
            (message.sender_email === senderEmail && message.receiver_email === receiverEmail) ||
            (message.sender_email === receiverEmail && message.receiver_email === senderEmail);

          if (isRelevant) {
            setMessages((prev) => [...prev, message]);
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [senderEmail, receiverEmail]);

  if (!receiverEmail) {
    return (
      <div style={{ padding: "1rem", color: "red" }}>
        Error: Missing receiver email — go back to the product and click "Chat with Seller".
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-box">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`message ${m.sender_email === senderEmail ? "sent" : "received"}`}
          >
            {m.content}
          </div>
        ))}
      </div>

      <div className="message-input-box">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;












// import { useUser } from "./contextprovider";
// import { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { supabase } from "../supabaseClient";
// import "./chatbox.css";

// function ChatBox() {
//   const senderEmail = useUser();
//   const location = useLocation();

//   // Get receiverEmail from navigate state
//   const receiverEmail = location.state?.receiverEmail || null;

//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");

//   // Fetch existing messages between sender & receiver
//   const fetchMessages = async () => {
//     if (!receiverEmail || !senderEmail) return;

//     const { data, error } = await supabase
//       .from("messages")
//       .select("*")
//       .or(
//         `and(sender_email.eq.${senderEmail},receiver_email.eq.${receiverEmail}),and(sender_email.eq.${receiverEmail},receiver_email.eq.${senderEmail})`
//       )
//       .order("created_at", { ascending: true });

//     if (error) {
//       console.error("Error fetching messages:", error.message);
//     } else {
//       setMessages(data || []);
//     }
//   };

//   // Send new message
//   const sendMessage = async () => {
//     if (!receiverEmail) {
//       alert("No receiver specified.");
//       return;
//     }

//     if (!newMessage.trim()) return;

//     const { error } = await supabase.from("messages").insert([
//       {
//         sender_email: senderEmail,
//         receiver_email: receiverEmail,
//         content: newMessage,
//       },
//     ]);

//     if (error) {
//       console.error("Error inserting message:", error.message);
//     } else {
//       setNewMessage("");
//     }
//   };

//   useEffect(() => {
//     if (!receiverEmail || !senderEmail) return;

//     fetchMessages();

//     // Normalize channel name so both parties subscribe to the same channel
//     const chatParticipants = [senderEmail, receiverEmail].sort().join("-");
//     const channelName = `private-chat-${chatParticipants}`;

//     const channel = supabase
//       .channel(channelName)
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "messages" },
//         (payload) => {
//           const message = payload.new;
//           const isRelevant =
//             (message.sender_email === senderEmail &&
//               message.receiver_email === receiverEmail) ||
//             (message.sender_email === receiverEmail &&
//               message.receiver_email === senderEmail);

//           if (isRelevant) {
//             setMessages((prev) => [...prev, message]);
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [senderEmail, receiverEmail]);

//   if (!receiverEmail) {
//     return (
//       <div style={{ padding: "1rem", color: "red" }}>
//         Error: Missing receiver email — go back to the product and click
//         "Chat with Seller".
//       </div>
//     );
//   }

//   return (
//     <div className="chat-container">
//       <div className="messages-box">
//         {messages.map((m) => (
//           <div
//             key={m.id}
//             className={`message ${
//               m.sender_email === senderEmail ? "sent" : "received"
//             }`}
//           >
//             {m.content}
//           </div>
//         ))}
//       </div>

//       <div className="message-input-box">
//         <input
//           type="text"
//           placeholder="Type a message"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//         />
//         <button onClick={sendMessage}>Send</button>
//       </div>
//     </div>
//   );
// }

// export default ChatBox;
