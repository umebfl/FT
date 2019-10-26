import * as R from 'ramda'
import React, {Component} from 'react'

import echarts  from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import ReactEcharts from 'echarts-for-react'

import {
    Popover,
    Button,
} from 'antd'

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
                target,
                todo,
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
                        <span>一手保证金</span>
                        <span>资金配比</span>
                        <span style={{width: '80px'}}>优先级</span>
                        <span style={{width: '80px'}}>累计盈利</span>
                        <span>月份</span>
                        <span>行业</span>
                        <span>1元波动</span>
                        <span>保证金比例</span>
                    </div>
                    {
                        R.map(
                            v => (
                                <div className='ft_table_list' key={v.code}>
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
                                    <span>{parseInt(v.bond / 100) * 100}</span>
                                    <span>{v.fund} / {v.can_buy}</span>
                                    <span style={{width: '80px'}}>
                                        <Popover trigger='click' placement='topLeft' content={get_priority_arr(v)} title='权重列表'>
                                            <div className='can_click'>{v.priority}</div>
                                        </Popover>
                                    </span>
                                    <span style={{width: '80px'}}>{v.profit}</span>
                                    <span>{v.month}</span>
                                    <span>{v.industry}</span>
                                    <span>{v.bond_count}</span>
                                    <span>{v.lever}</span>
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
                                                {v.target}
                                            </div>
                                            <div className='item_use'>
                                                {v.use}
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

                    <div className='liabilities'>
                        <div className='title'>负债 ({R.reduce((a, b) => a + (b.balance || 0), 0)(expenditure)})</div>
                        <div className='list'>
                            {
                                R.addIndex(R.map)(
                                    (v, k) => v.balance ? (
                                        <div id={k}>
                                            <div className='item_name'>
                                                {v.id}
                                            </div>
                                            <div className='item_money'>
                                                {v.balance}
                                            </div>
                                        </div>
                                    ) : ''
                                )(expenditure)
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

                    <div className='target'>
                        <div className='title'>目标</div>
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
                                            <div>
                                                {v.finish ? 'ok' : '-'}
                                            </div>
                                        </div>
                                    )
                                )(target)
                            }
                        </div>
                    </div>

                    <div className='todo'>
                        <div className='title'>待办</div>
                        <div className='list'>
                            {
                                R.addIndex(R.map)(
                                    (v, k) => (
                                        <div id={k}>
                                            <div className='item_name'>
                                                {v.msg}
                                            </div>
                                            <div className='item_money'>
                                                {v.target}
                                            </div>
                                        </div>
                                    )
                                )(todo)
                            }
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

const get_priority_arr = payload => {
        return (
            <div className='priority_list'>
                {
                    R.compose(
                        R.addIndex(R.map)(
                            (v, k) => (
                                <div id={k}>{v.text}: {v.val}</div>
                            )
                        ),
                        R.sort(
                            (a, b) => b.val - a.val
                        )
                    )(payload.priority_arr || [])
                }
            </div>
        )
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
