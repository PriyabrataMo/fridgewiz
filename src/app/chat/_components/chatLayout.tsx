import ChatHeader from "./chatHeader";
// import ChatSidebar from "./chatSidebar";
import ChatMainArea from "./chatMainArea";

export default function ChatLayout() {
  return (
    <div className="flex h-screen">
      {/* Optional sidebar */}
      {/* <ChatSidebar /> */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <ChatMainArea />
      </div>
    </div>
  );
}
