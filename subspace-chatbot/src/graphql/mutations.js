import { gql } from '@apollo/client'
export const CREATE_CHAT = gql`
  mutation CreateChat($title: String) {
    insert_chats_one(object: { title: $title }) { id title created_at }
  }
`
export const INSERT_MESSAGE = gql`
  mutation InsertMessage($chat_id: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: { chat_id: $chat_id, content: $content, role: $role }) { id created_at }
  }
`
export const CALL_SEND_MESSAGE_ACTION = gql`
  mutation CallSendMessageAction($input: SendMessageInput!) {
    sendMessage(input: $input) { success reply_message_id reply_content }
  }
`
