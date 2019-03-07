var _$encode = function (_map, _content) {
    _content = '' + _content;
    if (!_map || !_content) {
        return _content || '';
    }
    return _content.replace(_map.r, function ($1) {
        var _result = _map[!_map.i ? $1.toLowerCase() : $1];
        return _result != null ? _result : $1;
    });
};

/**
 * 日期格式化
 * @return string
 */
var dateFormat = (function () {
    var _map = { i: !0, r: /\byyyy|yy|MM|cM|eM|M|dd|d|HH|H|mm|ms|ss|m|s|w|ct|et\b/g },
        _12cc = ['上午', '下午'],
        _12ec = ['A.M.', 'P.M.'],
        _week = ['日', '一', '二', '三', '四', '五', '六'],
        _cmon = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
        _emon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    var _fmtnmb = function (_number) {
        _number = parseInt(_number, 10) || 0;
        return (_number < 10 ? '0' : '') + _number;
    };
    var _fmtclc = function (_hour) {
        return _hour < 12 ? 0 : 1;
    };
    return function (_time, _format, _12time) {
        if (!_time || !_format)
            return '';
        _time = new Date(_time);
        _map.yyyy = _time.getFullYear();
        _map.yy = ('' + _map.yyyy).substr(2);
        _map.M = _time.getMonth() + 1;
        _map.MM = _fmtnmb(_map.M);
        _map.eM = _emon[_map.M - 1];
        _map.cM = _cmon[_map.M - 1];
        _map.d = _time.getDate();
        _map.dd = _fmtnmb(_map.d);
        _map.H = _time.getHours();
        _map.HH = _fmtnmb(_map.H);
        _map.m = _time.getMinutes();
        _map.mm = _fmtnmb(_map.m);
        _map.s = _time.getSeconds();
        _map.ss = _fmtnmb(_map.s);
        _map.ms = _time.getMilliseconds();
        _map.w = _week[_time.getDay()];
        var _cc = _fmtclc(_map.H);
        _map.ct = _12cc[_cc];
        _map.et = _12ec[_cc];
        if (!!_12time) {
            _map.H = _map.H % 12;
        }
        return _$encode(_map, _format);
    };
})();

/**
 * 时间戳转化为日期（用于消息列表）
 * @return {string} 转化后的日期
 */
export let transTime = (function () {
    var getDayPoint = function (time) {
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        time.setHours(0);
        var today = time.getTime();
        time.setMonth(1);
        time.setDate(1);
        var yearDay = time.getTime();
        return [today, yearDay];
    }
    return function (time) {
        var check = getDayPoint(new Date());
        if (time >= check[0]) {
            return dateFormat(time, "HH:mm")
        } else if (time < check[0] && time >= check[1]) {
            return dateFormat(time, "MM-dd HH:mm")
        } else {
            return dateFormat(time, "yyyy-MM-dd HH:mm")
        }
    }
})();
/**
 * 时间戳转化为日期(用于左边会话面板)
 * @return {string} 转化后的日期
 */
export let transTime2 = (function () {
    var getDayPoint = function (time) {
        time.setMinutes(0);
        time.setSeconds(0);
        time.setMilliseconds(0);
        time.setHours(0);
        var today = time.getTime();
        time.setMonth(1);
        time.setDate(1);
        var yearDay = time.getTime();
        return [today, yearDay];
    }
    return function (time) {
        var check = getDayPoint(new Date());
        if (time >= check[0]) {
            return dateFormat(time, "HH:mm")
        } else if (time >= check[0] - 60 * 1000 * 60 * 24) {
            return "昨天";
        } else if (time >= (check[0] - 2 * 60 * 1000 * 60 * 24)) {
            return "前天";
        } else if (time >= (check[0] - 7 * 60 * 1000 * 60 * 24)) {
            return "星期" + dateFormat(time, "w");
        } else if (time >= check[1]) {
            return dateFormat(time, "MM-dd")
        } else {
            return dateFormat(time, "yyyy-MM-dd")
        }
    }
})();