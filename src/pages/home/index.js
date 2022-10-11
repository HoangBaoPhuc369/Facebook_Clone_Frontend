import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import CreatePost from "../../components/createPost";
import Header from "../../components/header";
import LeftHome from "../../components/home/left";
import RightHome from "../../components/home/right";
import SendVerification from "../../components/home/sendVerification";
import Stories from "../../components/home/stories";
import Post from "../../components/post";
import "./style.css";

export default function Home({ setVisible,  loading, getAllPosts }) { //posts,
  const { user } = useSelector((state) => ({ ...state }));
  const middle = useRef(null);
  const [height, setHeight] = useState(0);
  const [onlineUser, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    setHeight(middle.current.clientHeight);
  }, [loading]);

  //Get conversation
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_BACKEND_URL}/chat/conversations`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, []);


  const posts = [
    {
        "_id": "6333c6f602672eb73b386b62",
        "type": null,
        "text": "Mu mai dinh",
        "user": {
            "_id": "63257d515b888dcf66525601",
            "first_name": "luan",
            "last_name": "nguyen",
            "username": "luannguyen_MrFyC2iag",
            "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
            "gender": "male",
            "cover": "https://res.cloudinary.com/same-cloud/image/upload/v1663385802/facebook-clone/LuanNguyen_gwxgepkI1/post_images/xmslhrc2qej6d4fce44r.png"
        },
        "background": "../../../images/postbackgrounds/1.jpg",
        "images": [],
        "comments": [],
        "createdAt": "2022-09-28T04:00:54.905Z",
        "updatedAt": "2022-09-28T04:00:54.905Z",
        "__v": 0
    },
    {
        "_id": "6325ddd43aa504717f5c1ac5",
        "type": "profilePicture",
        "text": "",
        "images": [
            {
                "url": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
                "_id": "6325ddd43aa504717f5c1ac6"
            }
        ],
        "user": {
            "_id": "63257d515b888dcf66525601",
            "first_name": "luan",
            "last_name": "nguyen",
            "username": "luannguyen_MrFyC2iag",
            "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
            "gender": "male",
            "cover": "https://res.cloudinary.com/same-cloud/image/upload/v1663385802/facebook-clone/LuanNguyen_gwxgepkI1/post_images/xmslhrc2qej6d4fce44r.png"
        },
        "background": null,
        "comments": [],
        "createdAt": "2022-09-17T14:46:44.868Z",
        "updatedAt": "2022-09-17T14:46:44.868Z",
        "__v": 0
    },
    {
        "_id": "6325cdea1541ca2a5dd7cc52",
        "type": null,
        "text": "Mu mai dinh",
        "images": null,
        "user": {
            "_id": "63257d515b888dcf66525601",
            "first_name": "luan",
            "last_name": "nguyen",
            "username": "luannguyen_MrFyC2iag",
            "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
            "gender": "male",
            "cover": "https://res.cloudinary.com/same-cloud/image/upload/v1663385802/facebook-clone/LuanNguyen_gwxgepkI1/post_images/xmslhrc2qej6d4fce44r.png"
        },
        "background": "../../../images/postbackgrounds/1.jpg",
        "comments": [
            {
                "comment": "Mu vo doi",
                "image": "",
                "parentId": "",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-09-28T04:26:01.168Z",
                "_id": "6333ccd902672eb73b386b66"
            },
            {
                "comment": "haha",
                "image": "",
                "parentId": "6333ccd902672eb73b386b66",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-09-28T04:31:15.185Z",
                "_id": "6333ce1302672eb73b386b6c"
            },
            {
                "comment": "comment lv1",
                "image": "",
                "parentId": "",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-10-02T01:05:04.568Z",
                "_id": "6338e3c0d2d7b99ea89f8a77"
            },
            {
                "comment": "comment lv2",
                "image": "",
                "parentId": "6338e3c0d2d7b99ea89f8a77",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-10-02T01:05:30.037Z",
                "_id": "6338e3dad2d7b99ea89f8a7a"
            },
            {
              "comment": "comment lv222",
              "image": "",
              "parentId": "6338e3c0d2d7b99ea89f8a77",
              "commentBy": {
                  "_id": "63257d515b888dcf66525601",
                  "first_name": "luan",
                  "last_name": "nguyen",
                  "username": "luannguyen_MrFyC2iag",
                  "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
              },
              "commentAt": "2022-10-02T01:05:30.037Z",
              "_id": "6338e3dad2d7b123789f8a7a"
          },
            {
                "comment": "comment lv3",
                "image": "",
                "parentId": "6338e3dad2d7b99ea89f8a7a",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-10-02T01:05:55.154Z",
                "_id": "6338e3f3d2d7b99ea89f8a7d"
            },
            {
              "comment": "comment lv3 comment lv3",
              "image": "",
              "parentId": "6338e3dad2d7b99ea89f8a7a",
              "commentBy": {
                  "_id": "63257d515b888dcf66525601",
                  "first_name": "luan",
                  "last_name": "nguyen",
                  "username": "luannguyen_MrFyC2iag",
                  "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
              },
              "commentAt": "2022-10-02T01:05:55.154Z",
              "_id": "6338e3ber2d7b99ea89f8a7d"
          }
        ],
        "createdAt": "2022-09-17T13:38:50.019Z",
        "updatedAt": "2022-10-02T01:05:55.155Z",
        "__v": 0
    },
    {
        "_id": "63258c5993f1184958f30f8c",
        "type": null,
        "text": "vo iu",
        "images": [
            {
                "url": "https://res.cloudinary.com/same-cloud/image/upload/v1663405145/facebook-clone/luannguyen_MrFyC2iag/post_images/xp80qxz2aqsjowvlxzzw.jpg",
                "_id": "63258c5993f1184958f30f8d"
            }
        ],
        "user": {
            "_id": "63257d515b888dcf66525601",
            "first_name": "luan",
            "last_name": "nguyen",
            "username": "luannguyen_MrFyC2iag",
            "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg",
            "gender": "male",
            "cover": "https://res.cloudinary.com/same-cloud/image/upload/v1663385802/facebook-clone/LuanNguyen_gwxgepkI1/post_images/xmslhrc2qej6d4fce44r.png"
        },
        "background": null,
        "comments": [
            {
                "parentId": "",
                "_id": "6338e45ad2d7b99ea89f8a8c",
                "comment": "vo mai dinh",
                "image": "",
                "commentBy": {
                    "_id": "63257d515b888dcf66525601",
                    "first_name": "luan",
                    "last_name": "nguyen",
                    "username": "luannguyen_MrFyC2iag",
                    "picture": "https://res.cloudinary.com/same-cloud/image/upload/v1663426004/facebook-clone/luannguyen_MrFyC2iag/profile_pictures/kvcc3k5jy7wclhzwqei7.jpg"
                },
                "commentAt": "2022-09-17T13:36:08.845Z"
            }
        ],
        "createdAt": "2022-09-17T08:59:05.481Z",
        "updatedAt": "2022-09-17T13:36:08.847Z",
        "__v": 0
    }
]


  return (
    <div className="home" style={{ height: `${height + 250}px` }}>
      <Header
        page="home"
        getAllPosts={getAllPosts}
        onlineUser={onlineUser}
        setOnlineUsers={setOnlineUsers}
        conversations={conversations}
      />
      <LeftHome user={user} />
      <div className="home_middle" ref={middle}>
        <Stories user={user} />
        {user.verified === false && <SendVerification user={user} />}
        <CreatePost user={user} setVisible={setVisible} />
        {loading ? (
          <div className="skeleton_loader">
            <HashLoader color="#1876f2" />
          </div>
        ) : (
          <div className="posts">
            {posts.map((post, i) => (
              <Post key={post?._id} post={post} user={user} />
            ))}
          </div>
        )}
      </div>
      <RightHome onlineUser={onlineUser} conversations={conversations} />
    </div>
  );
}
