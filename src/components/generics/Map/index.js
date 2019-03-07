import React, { Component } from 'react';
import "./index.css";
import $ from 'jquery';

function locationIsUpdated( preLocation, newLocation ) {
    if ( preLocation[0] === newLocation[0] && preLocation[1] === newLocation[1] ) {
        return false;
    }
    return true;
}

class Map extends Component{
    constructor( props ) {
        super( props );
        this.state = {
            location: [],
            node: undefined
        }
    }
    static getDerivedStateFromProps( nextProps, preState ) {
        if ( !!preState.node && ( locationIsUpdated( preState.location, nextProps.location ) || nextProps.focusRefresh ) ) {
            refreshMap( nextProps.mapId, nextProps.location );
        }
        return {
            location: nextProps.location
        }
    }

    getNode = ( node ) => {
        this.setState( {
            node
        } )
    }

    /**
     * 手机找回处地图组件
    */
    render () {
        let { classes, mapId } = this.props;
        return (
            <div id={mapId} className={'map ' + classes.join( ' ' )} ref={this.getNode}></div>
        )
    }
}

export default Map;

function refreshMap( mapId, lnglateXY ) {
    let AMap = window.AMap;
    var map = new AMap.Map( mapId, {
        resizeEnable: true,
        zoom: 15,
        // level: 2,
        center: lnglateXY
    });
    AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.OverView', 'AMap.MapType', "AMap.Geocoder"],
        function () {
            map.addControl(new AMap.ToolBar());
            map.addControl(new AMap.Scale());
            map.addControl(new AMap.OverView({isOpen: true}));
            map.addControl(new AMap.Geocoder({
                city: "010", //城市，默认：“全国”
                radius: 100 //范围，默认：500
            }))
        });
    //定位
    var marker = new AMap.Marker({
        position: map.getCenter(),
        // content: 'text'
    });
    marker.setMap(map);
    // 设置label标签
    marker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(-30, -36),//修改label相对于maker的位置
        content: "手机的位置"
    });

    //info window
    var local = lnglateXY.join(',');
    $.getJSON("https://restapi.amap.com/v3/geocode/regeo?location=" + local + "&extensions=base&output=json&key=0bc9a80586a664ba833f590ff8aec0d2", function (res) {
        var title = "现在的位置：",
            content = [];
        content.push(res.regeocode.formatted_address);

        var infoWindow = new AMap.InfoWindow({
            isCustom: true,  //使用自定义窗体
            content: createInfoWindow(title, content.join("<br>")),
            offset: new AMap.Pixel(16, -150)//-113, -140
        });
        infoWindow.open(map, lnglateXY);
    });

    //info window close
    var circle = new AMap.Circle({
        center: lnglateXY,
        radius: 20,
        fillOpacity: 0.2,
        strokeWeight: 1
    });
    circle.setMap(map);

    // 关闭信息窗体
    function closeInfoWindow() {
        map.clearInfoWindow();
    }

//构建自定义信息窗体
    function createInfoWindow(title, content) {
        var info = document.createElement("div");
        info.className = "info";

        info.style = "padding: 4%;background-color:white;border-radius:2%;width:86%;";
        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        titleD.style = "background-color:white;position:relative;";
        closeX.src = "https://webapi.amap.com/images/close2.gif";
        closeX.onclick = closeInfoWindow;
        closeX.style = "position:absolute;top:-40%;right:-4%;";
        top.appendChild(titleD);
        titleD.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);
        return info;
    }
}