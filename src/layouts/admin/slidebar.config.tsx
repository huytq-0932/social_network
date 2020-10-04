import {
  HomeOutlined,
  FacebookOutlined,
  LikeOutlined,
  CommentOutlined,
} from "@ant-design/icons";

const sidebar = [
  {
    routeName: "frontend.admin.dashboard.index",
    icon: <HomeOutlined />,
    routeParams: {},
  },
  {
    routeName: "frontend.admin.fbUsers.index",
    icon: <HomeOutlined />,
    routeParams: {},
  },
  {
    routeName: "frontend.admin.facebookIndex",
    icon: <FacebookOutlined />,
    type: "sub",
    routeParams: {},
    children: [
      {
        routeName: "/admin/facebook/like",
        icon: <LikeOutlined />,
        routeParams: {},
      },
      {
        routeName: "/admin/facebook/comment",
        icon: <CommentOutlined />,
        routeParams: {},
        // permissions: {
        //   "users": "R",
        // },
      },
    ],
  },
];

export default sidebar;
