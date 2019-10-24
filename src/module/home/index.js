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
    DISTRIBUTION_HAQ,
    DISTRIBUTION_HWG,
} from './reducer'

// 定时请求
const SEARCH_INTERVAL = 1000 * 10

class Home extends Component {

    componentDidMount() {
        // this.props.action.search()

        this.props.action.reflush_log({
            callback: this.props.action.search,
        })

        this.timer_interval = setInterval(this.props.action.search, SEARCH_INTERVAL)
    }

    componentWillUnmount() {
        clearInterval(this.timer_interval)
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
                assets,
                expenditure,
                cash,
            },
            t,
            action,
        } = this.props

        return (
            <div className='home'>

                <div className='ft_table'>
                    <div className='ft_table_title'>
                        <span style={{width: '50px'}}>品种</span>
                        <span style={{width: '80px'}}>价格(%)</span>
                        <span style={{width: '80px'}}>波幅(%)</span>
                        <span className='hidden' style={{width: '80px'}}>近月预估</span>
                        <span className='hidden' style={{width: '80px'}}>近周预估</span>
                        <span className='hidden' style={{width: '80px'}}>操作提示</span>
                        <span>价格状态(%)</span>
                        <span>近一年走势(%)</span>
                        <span>近半年走势(%)</span>
                        <span>近三月走势(%)</span>
                        <span>近一月走势(%)</span>
                        <span>近一周走势(%)</span>
                        <span className='hidden'>月份</span>
                        <span>行业</span>
                        <span className='hidden'>1元波动</span>
                        <span>一手保证金</span>
                        <span>保证金比例</span>
                        <span>资金配比</span>
                        <span style={{width: '80px'}}>优先级</span>
                        <span style={{width: '80px'}}>累计盈利</span>
                    </div>
                    {
                        R.map(
                            v => (
                                <div key={v.code}>
                                    <span style={{width: '50px'}} className={v.distribution === DISTRIBUTION_HAQ ? 'ft_haq' : ''}>
                                        {v.name}
                                    </span>
                                    <span style={{width: '80px'}} className={v.wave > 0 ? 'ft_up' : 'ft_down'}>
                                        {v.price}
                                    </span>
                                    <span style={{width: '80px'}} className={v.wave > 0 ? 'ft_up' : 'ft_down'}>
                                        {v.wave}
                                    </span>
                                    <span className='hidden' style={{width: '80px'}}></span>
                                    <span className='hidden' className='hidden' style={{width: '80px'}}></span>
                                    <span className='hidden' style={{width: '80px'}}></span>
                                    <span className={v.price_state_str === '中位' ? '' : v.price_state > 50 ? 'ft_up' : 'ft_down'}>
                                        {v.price_state_str} / {v.price_state}
                                    </span>
                                    <span className={v.nearly_year_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_year_str} / {v.nearly_year_rate}
                                    </span>
                                    <span className={v.nearly_half_year_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_half_year_str} / {v.nearly_half_year_rate}
                                    </span>
                                    <span className={v.nearly_3_month_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_3_month_str} / {v.nearly_3_month_rate}
                                    </span>
                                    <span className={v.nearly_month_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_month_str} / {v.nearly_month_rate}
                                    </span>
                                    <span className={v.nearly_week_str === '多' ? 'ft_up' : 'ft_down'}>
                                        {v.nearly_week_str} / {v.nearly_week_rate}
                                    </span>
                                    <span className='hidden'>{v.month}</span>
                                    <span>{v.industry}</span>
                                    <span className='hidden'>{v.bond_count}</span>
                                    <span>{v.bond}</span>
                                    <span>{v.lever}</span>
                                    <span>{v.fund} / {v.can_buy}</span>
                                    <span style={{width: '80px'}}>{v.priority}</span>
                                    <span>{v.profit}</span>
                                </div>
                            )
                        )(variety)
                    }
                </div>

                <div className='info'>
                    <div className='assets'>
                        <div className='title'>资产 ({R.reduce((a, b) => a + b.money, 0)(assets)})</div>
                        <div className='list'>
                            {
                                R.addIndex(R.map)(
                                    (v, k) => (
                                        <div id={k}>
                                            <div className='item_name'>
                                                {v.id}
                                            </div>
                                            <div className='item_money'>
                                                {v.money}
                                            </div>
                                        </div>
                                    )
                                )(assets)
                            }
                        </div>
                    </div>

                    <div className='expenditure'>
                        <div className='title'>每月支出 ({R.reduce((a, b) => a + b.money, 0)(expenditure)})</div>
                        <div className='list'>
                            {
                                R.addIndex(R.map)(
                                    (v, k) => (
                                        <div id={k}>
                                            <div className='item_name'>
                                                {v.id}
                                            </div>
                                            <div className='item_money'>
                                                {v.money}
                                            </div>
                                        </div>
                                    )
                                )(expenditure)
                            }
                        </div>
                    </div>

                    <div className='expenditure'>
                        <div className='title'>出入金</div>
                        <div className='list'>
                            {
                                R.addIndex(R.map)(
                                    (v, k) => (
                                        <div id={k}>
                                            <div className='item_name'>
                                                {v.msg}
                                            </div>
                                            <div className='item_money'>
                                                {v.money}
                                            </div>
                                        </div>
                                    )
                                )(cash)
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

// <ReactEcharts option={this.get_option()} style={{height:'400px'}}/>

export default connect(
    state => ({
        home: state.home,
        t: state.i18n.t,
    }),
    dispatch => ({
        action: bindActionCreators(action, dispatch),
    })
)(Home)
