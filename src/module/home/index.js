import * as R from 'ramda'
import React, {Component} from 'react'

import echarts  from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import ReactEcharts from 'echarts-for-react'

import {
    bindActionCreators,
} from 'redux'

import {
    connect,
} from 'react-redux'

import {
    action,
} from './reducer'



class Home extends Component {

    componentDidMount() {
        // this.props.action.search()

        this.props.action.reflush_log({
            callback: this.props.action.search,
        })

    }

    get_option() {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            },
            yAxis: {
                type: 'value',
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
            }],
        }
    }

    render() {
        const {
            history,
            home: {
                variety,
            },
            t,
            action,
        } = this.props

        return (
            <div className='home'>

                <div className='ft_table'>
                    <div className='ft_table_title'>
                        <span>品种</span>
                        <span>月份</span>
                        <span>行业</span>
                        <span>价格</span>
                        <span>一手保证金</span>
                        <span>保证金比例</span>
                        <span>近半年走势</span>
                        <span>近一月走势</span>
                        <span>近一周走势</span>
                    </div>
                    {
                        R.map(
                            v => (
                                <div key={v.code}>
                                    <span>{v.name}</span>
                                    <span>{v.month}</span>
                                    <span>{v.industry}</span>
                                    <span>{v.price}</span>
                                    <span>{v.bond}</span>
                                    <span>{v.lever}</span>
                                    <span className={v.nearly_half_year_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_half_year_str} / {v.nearly_half_year} / {v.nearly_half_year_rate}
                                    </span>
                                    <span className={v.nearly_month_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_month_str} / {v.nearly_month} / {v.nearly_month_rate}
                                    </span>
                                    <span className={v.nearly_week_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_week_str} / {v.nearly_week} / {v.nearly_week_rate}
                                    </span>
                                </div>
                            )
                        )(variety)
                    }
                </div>

                <ReactEcharts option={this.get_option()} style={{height:'400px'}}/>
            </div>
        )
    }
}

export default connect(
    state => ({
        home: state.home,
        t: state.i18n.t,
    }),
    dispatch => ({
        action: bindActionCreators(action, dispatch),
    })
)(Home)
