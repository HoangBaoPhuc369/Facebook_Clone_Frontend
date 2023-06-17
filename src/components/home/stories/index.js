import { Plus } from "../../../svg";
import ReelsIcon from "../../../svg/ReelsIcon";
import StoryIcon from "../../../svg/StoryIcon";
import LockIcon from "../../../svg/lockIcon";
import MessengerIcon from "../../../svg/messengerIcon";
import ShareCardIcon from "../../../svg/shareCardIcon";
import "./style.css";
export default function Stories({ user }) {
  return (
    <div className="story-wrapper">
      <div className="w-full h-[72px] px-[18px] flex mb-4 border-b-[1px] border-solid story-header">
        <div
          className="h-full w-full flex justify-center items-center gap-2
         border-b-[3.5px] border-[#1876f2]"
        >
          <StoryIcon width="20px" className="text-[#1876f2]" />
          <p className="font-medium text-[#1876f2]">Stories</p>
        </div>
        <div className="h-full w-full flex justify-center items-center gap-2">
          <ReelsIcon width="20px" className="text-[#65676b]" />
          <p className="font-medium text-[#65676b]">Reels</p>
        </div>
      </div>
      <div className="pt-[10px] pr-[15px] pb-4 pl-[15px]">
        <div className="stories">
          {/* <div className="create_story_card">
            <img src={user?.picture} alt="" className="create_story_img" />
            <div className="plus_story">
              <Plus color="#fff" />
            </div>
            <div className="story_create_text">Create Story</div>
          </div> */}

          <div className="story">
            <img src={user?.picture} alt="" className="story_img" />
            <div className="story-bottom">
              <div className="plus_story">
                <Plus color="#fff" />
              </div>
              <div className="story_create_text">Create Story</div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 mb-2 story-side">
              <div className="p-[6px]">
                <ShareCardIcon width="24px" height="24px" />
              </div>
              <p className="text-[13px]">
                Share everyday moments with friends and family.
              </p>
            </div>
            <div className="flex items-center gap-1 mb-2 story-side">
              <div className="p-[6px]">
                <LockIcon width="24px" />
              </div>
              <p className="text-[13px]">Stories disappear after 24 hours.</p>
            </div>
            <div className="flex items-center gap-1 mb-2 story-side">
              <div className="p-[6px]">
                <MessengerIcon width="24px" />
              </div>
              <p className="text-[13px]">Replies and reactions are private.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
