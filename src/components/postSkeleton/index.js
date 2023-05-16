import Skeleton from "react-loading-skeleton";

import "./style.css";

const PostSkeleton = () => {
  return (
    <div className="post">
      <div className="flex px-[15px] py-[10px] gap-[10px]">
        <div className="post-avatar">
          <Skeleton circle={true} height={40} width={40} />
        </div>
        <div className="post-meta">
          <div>
            <Skeleton height={10} width={110} style={{ borderRadius: "5px" }} />
            <Skeleton height={10} width={80} style={{ borderRadius: "5px" }} />
          </div>
        </div>
      </div>
      <div className="post-footer">
        <div className="post-actions">
          <div className="post-action">
            <Skeleton
              height={10}
              width={66}
              containerClassName="avatar-skeleton"
            />
          </div>
          <div className="post-action">
            <Skeleton
              height={10}
              width={66}
              containerClassName="avatar-skeleton"
            />
          </div>
          <div className="post-action">
            <Skeleton
              height={10}
              width={66}
              containerClassName="avatar-skeleton"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
