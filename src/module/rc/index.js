import * as R from 'ramda'
import React, {Component} from 'react'
import cn from 'classnames'

import {
    Icon,
    Timeline,
    List,
    Tag,
} from 'antd'

import {
    bindActionCreators,
} from 'redux'

import {
    connect,
} from 'react-redux'

import {
    action,
} from './reducer'

class Rc extends Component {

    render() {
        const {
            history,
            rc: {
                occupational_system,
                element,
                flow,
                capital,
                idea,
                strategy,
            },
            t,
            action,
        } = this.props


        return (
            <div className='rc'>
                <div className='type system'>
                    <div className='type_title'>
                        <Icon type='safety'/>
                        <div className='type_title_text'>交易系统</div>
                    </div>

                    <div>

                    </div>
                </div>

                <div className='type rule'>
                    <div className='type_title'>
                        <Icon type='bug'/>
                        <div className='type_title_text'>规则</div>
                    </div>

                    <div>

                    </div>
                </div>

                <div className='type strategy'>
                    <div className='type_title'>
                        <Icon type='insurance'/>
                        <div className='type_title_text'>交易策略</div>
                    </div>

                    <div>
                        <List
                            size='small'
                            dataSource={strategy}
                            renderItem={item => (
                                <List.Item>
                                    {item.text}
                                </List.Item>
                            )}/>
                    </div>
                </div>

                <div className='type idea'>
                    <div className='type_title'>
                        <Icon type='reddit'/>
                        <div className='type_title_text'>理念</div>
                    </div>

                    <div>
                        <List
                            size='small'
                            dataSource={idea}
                            renderItem={item => (
                                <List.Item>
                                    {
                                        R.map(
                                            v => <Tag color='blue' key={v}>{v}</Tag>
                                        )(item.type)
                                    }
                                    {item.content}
                                </List.Item>
                            )}/>
                    </div>
                </div>

                <div className='type element'>
                    <div className='type_title'>
                        <Icon type='deployment-unit'/>
                        <div className='type_title_text'>元素</div>
                    </div>

                    <div className='element_content'>
                        {
                            R.map(
                                v => (
                                    <div key={v} className='element_item'>{v}</div>
                                )
                            )(element)
                        }
                    </div>
                </div>

                <div className='type capital'>
                    <div className='type_title'>
                        <Icon type='transaction'/>
                        <div className='type_title_text'>资金分配</div>
                    </div>

                    <div>
                        <List
                            size='small'
                            dataSource={capital}
                            renderItem={item => (
                                <List.Item>
                                    {item.type}
                                </List.Item>
                            )}/>
                    </div>
                </div>

                <div className='type flow'>
                    <div className='type_title'>
                        <Icon type='thunderbolt'/>
                        <div className='type_title_text'>交易流程</div>
                    </div>

                    <div className='flow_content'>
                        <Timeline>
                            {
                                R.map(
                                    v => (
                                        <Timeline.Item>{v.text}</Timeline.Item>
                                    )
                                )(flow)
                            }
                        </Timeline>
                    </div>
                </div>

                <div className='type occupational_system'>
                    <div className='type_title'>
                        <Icon type='sketch'/>
                        <div className='type_title_text'>职业体系({occupational_system.name})</div>
                    </div>

                    <div className='type_msg'>
                        {occupational_system.core}
                    </div>

                    <div>
                        {
                            R.map(
                                v => (
                                    <div key={v.lv} className='occupational_system_info'>
                                        <div className='occupational_system_title'>
                                            <div className='occupational_system_title_lv'>Lv{v.lv}</div>
                                            <div className={cn('occupational_system_title_text', {'occupational_system_finish': v.finish})}>
                                                {v.title}{v.finish ? '(当前)' : ''}
                                            </div>
                                        </div>
                                        <div className='occupational_system_msg'>
                                            <div className='occupational_system_msg_target'>{v.target_cn}</div>
                                            <div className='occupational_system_msg_leader'>{v.leader}</div>
                                        </div>
                                    </div>
                                )
                            )(occupational_system.lv)
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        rc: state.rc,
        t: state.i18n.t,
    }),
    dispatch => ({
        action: bindActionCreators(action, dispatch),
    })
)(Rc)
