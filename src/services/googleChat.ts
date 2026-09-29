export interface ChatSpace {
  name: string; // e.g. "spaces/AAAAAAAAAA"
  displayName?: string;
  spaceType?: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  type?: string;
}

export interface SendMessageResponse {
  name: string;
  text: string;
  createTime: string;
}

export async function fetchChatSpaces(accessToken: string): Promise<ChatSpace[]> {
  const response = await fetch('https://chat.googleapis.com/v1/spaces', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}: Lỗi khi tải danh sách không gian Google Chat.`;
    throw new Error(message);
  }

  const data = await response.json();
  return (data.spaces || []).map((space: any) => ({
    name: space.name,
    displayName: space.displayName || space.name.replace('spaces/', 'Không gian Chat #'),
    spaceType: space.spaceType || space.type || 'SPACE',
  }));
}

export async function postMessageToChatSpace(
  accessToken: string,
  spaceName: string,
  text: string
): Promise<SendMessageResponse> {
  // spaceName is formatted like "spaces/ABCDEF"
  const formattedParent = spaceName.startsWith('spaces/') ? spaceName : `spaces/${spaceName}`;
  const url = `https://chat.googleapis.com/v1/${formattedParent}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}: Lỗi khi gửi tin nhắn đến Google Chat.`;
    throw new Error(message);
  }

  return response.json();
}
