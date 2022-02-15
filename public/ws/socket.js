const socket = io("wss://www.1inf.vanikthai.com", {
    withCredentials: true,
    extraHeaders: {
      vanikthaiapp: "abcd",
    },
  });

export default socket