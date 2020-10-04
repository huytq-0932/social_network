import React, { Fragment, createRef, useEffect, useState } from "react";
import {
    Menu,
    Layout,
    Avatar,
    Button,
    Input,
    Popover,
    Descriptions,
    Row,
    Col,
    Tooltip,
    AutoComplete,
    Select,
} from "antd";
import router from 'next/router'
import sidebar from "./slidebar.config";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    PoweroffOutlined,
    SettingFilled,
    TeamOutlined,
    MoneyCollectOutlined,
    RightOutlined,
    BellOutlined,
    UserOutlined,
    LogoutOutlined,
    SyncOutlined,
    KeyOutlined,
    SettingOutlined,
    UserSwitchOutlined,
    LeftOutlined
} from "@ant-design/icons";
import useBaseHook from "@src/hooks/BaseHook";
import _ from "lodash";
import { useRouter } from "next/router";
//import { removeAccents } from "themes/utils/String";
import auth from '@src/helpers/auth'
import ChangePassword from '@src/components/ChangePassword'
import {confirmDialog} from '@src/helpers/dialogs'
import adminService from "@root/src/services/adminService";

const { Header } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;

const AdminHeader = (props: any) => {
    const {
        t,
        notify,
        redirect,
        setStore,
        getStore,
        getData,
    } = useBaseHook();
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [showPopAccount, setShowPopAccount] = useState(false)
    const renderRightContent = () => {
        const username = getData(auth(), "user.username", "User");
        return (
            <div>
                <Popover
                    placement="bottom"
                    title={t("personalInfo")}
                    content={accountPopup()}
                    visible={showPopAccount}
                >
                    <Button
                        type="link"
                        className="header-btn"
                        onClick={() => setShowPopAccount(!showPopAccount)}
                    >
                        <p style={{ color: "white", display: "inline" }} >{username} </p><UserOutlined />
                    </Button>
                </Popover>
            </div>
        );
    };

    const accountPopup = () => {
        const { user } = auth()
        return (
          <React.Fragment>
            <div className="accountPopup">
              <Row gutter={[8, 8]}>
                <Col xs={12} md={7} lg={7}>
                  <div className="avatar">
                    <Avatar
                      icon={<UserOutlined />}
                      src={"https://ak0.picdn.net/shutterstock/videos/9291710/thumb/10.jpg"}
                      size={100}
                      shape="circle"
                    >
                      {user.fullname ? user.fullname[0] : ""}
                    </Avatar>
                  </div>
                </Col>
                <Col xs={12} md={17} lg={17}>
                  <Row>
                    <b>{t("username")}</b>: <i>{user.username}</i>
                  </Row>
                  <Row>
                    <b>{t("fullname")}</b>: <i>{user.fullname}</i>
                  </Row>
                  <div style={{ textAlign: "right" }}>
                    <Button
                      onClick={() => {setShowPopAccount(false); setShowChangePassword(true); }}
                      type="link"
                    >
                      {t("changePassword")} <SettingOutlined />
                    </Button>
                    <br />
                    <Button
                      type="link"
                      onClick={() => {
                        setShowPopAccount(false);
                          confirmDialog({
                              onOk: () => { auth().logout(); redirect("/admin/login")},
                            title: t("signout"),
                            content: t("message.signoutConfirm"),
                            okText: "Đồng ý",
                            cancelText: "Hủy",
                              
                        })
                      }}
                    >
                      {t("logout")} <UserSwitchOutlined />
                    </Button>
                  </div>
                </Col>
              </Row>
            </div>
          </React.Fragment>
        );
    };
    const onChangePassword = async (data: any): Promise<void> => {
        setShowChangePassword(false);
        let password = data.password;
        await adminService().withAuth().updateMyPassword({password})
    
        notify(t("message.recordUpdated"));
      };
    
      const renderPasswordDialog = () => {
        return (
          <ChangePassword
            onChangePassword={onChangePassword}
            visible={showChangePassword}
            onCancel={() => {
              setShowChangePassword(false);
            }}
          />
        );
      };

    const { collapsed, onCollapseChange } = props;
    const menuIconProps = {
        className: "trigger",
        onClick: () => onCollapseChange(!collapsed),
    };
    let headerClass = "header";
    if (collapsed) headerClass += " collapsed";


    return (
        <React.Fragment>
            <Header className={headerClass}>
                {collapsed ? (
                    <MenuUnfoldOutlined style={{ color: "#fff" }} {...menuIconProps} />
                ) : (
                        <MenuFoldOutlined style={{ color: "#fff" }} {...menuIconProps} />
                    )}

                <Tooltip title={t("Trở về trang trước")}>
                    <Button
                        icon={<LeftOutlined />}
                        type="link"
                        className="header-btn"
                        onClick={() => router.back()}
                    >Quay lại</Button>
                </Tooltip>

                <div className="rightContainer">{renderRightContent()}</div>
            </Header>
            {renderPasswordDialog()}
        </React.Fragment>
    );
};

export default AdminHeader;
