import { MessageCircle, User } from "lucide-react";
import ReplyNode from "./ReplyNode";

export default function RepliesSection({ discussion, replyTree, user }) {
  return (
    <>
      <div className="px-7 pt-5 pb-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">
            Replies
            <span className="ml-1.5 text-slate-400">
              ({discussion.replies.length})
            </span>
          </h3>
        </div>
      </div>

      {discussion.replies.length === 0 ? (
        <div className="flex flex-col items-center px-7 py-10 text-center">
          <User className="mb-2 h-8 w-8 text-slate-200" />
          <p className="text-sm text-slate-400">
            No replies yet &mdash; be the first to respond!
          </p>
        </div>
      ) : (
        <div className="px-7 pb-4">
          {replyTree.map((rootNode) => (
            <ReplyNode
              key={rootNode.id}
              node={rootNode}
              discussionId={discussion.id}
              depth={0}
              user={user}
            />
          ))}
        </div>
      )}
    </>
  );
}
