import React from 'react';
import { Row, Col, Avatar, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import useBaseHook from '@src/hooks/BaseHook'
import useSWR from 'swr'
import moment from 'moment'
import _ from 'lodash'
function numFormatter(num: number) {
    if (num > 999 && num < 1000000) {
        return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    } else if (num > 1000000) {
        return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    } else if (num < 900) {
        return num; // if value < 1000, nothing to do
    }
}
const Profile = () => {
    const {redirect, t, getData, } = useBaseHook()
    const auth = {};
    //const { data, error } = useSWR('companyService.sumaryInfo', () => companyService.sumaryInfo())
    const profileInfo = {
        companyLogo: "/static/logo-kita-250.jpg",
        partnerLogo: "/static/img/logo.png",
        groupName: "Nhân viên",
        userFullname: "KITA",
        companyName: "KITA",
        companyAddress: "Ứng dụng đóng logo nhanh nhất Việt Nam",
        today: {},
        expirationDate: "20-05-2021",
    
    }

    const renderExpire = (exp: any) => {
        if (_.isNull(exp)) {
            return (
                <Row>
                    <Col span={24}>
                        <p style={{color: "red"}}>Chưa kích hoạt!</p>
                    </Col>
                </Row>
            )
        }
        else {
            return (
                <Row>
                    <Col span={24}>
                        {t('expirationDate', { expirationDate: moment(exp).format("DD-MM-YYYY") })}
                    </Col>
                </Row>
            )
        }
    }
    return <div className="sidebar-profile">
        <Row>
            <Col xs={12}>
                <div className="profile-avatar">
                    <Avatar size={80} icon={<UserOutlined />} src={profileInfo.companyLogo} className="avatar" />
                </div>
            </Col>
            <Col xs={12}>
                <div className="profile-avatar">
                    <Avatar size={80} icon={<UserOutlined />} src={profileInfo.partnerLogo} className="avatar" />
                </div>
            </Col>
        </Row>
        <Row>
            <Col xs={24}>
                <div className="profile-companyName">{profileInfo.companyName}</div>
                <div className="profile-address">{profileInfo.companyAddress}</div>
            </Col>
            {/* <Col xs={24}>
                <div className="profile-userInfo">
                    <span className="profile-name">{profileInfo.userFullname}</span> - <span className="profile-groupName">{profileInfo.groupName}</span>
                </div>
            </Col> */}
        </Row>
        
        <div className="profile-expires">
        </div>
        <Row>
            <Col xs={22} offset={1}>
                <Divider className="profile-endLine" />
            </Col>
        </Row>


    </div>
}

export default Profile