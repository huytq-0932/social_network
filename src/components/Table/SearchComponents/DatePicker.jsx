import React from 'react'
import { DatePicker } from 'antd';
import _ from 'lodash'
import moment from 'moment'
const { RangePicker } = DatePicker;

class FilterDatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.getDates()
        }
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(prevProps.column.filteredValue) != JSON.stringify(this.props.column.filteredValue)) {
            this.setState({
                ...this.getDates()
            })
        }
    }

    getDates = (dateStrings) => {
        if(!dateStrings) dateStrings = _.get(this.props.column, "filteredValue[0].value", [])
        if (!dateStrings) return {}
        if (!dateStrings[0]) dateStrings[0] = undefined
        if(!dateStrings[1]) dateStrings[1] = undefined
        return {
            dateStrings: dateStrings,
            dates: [
                dateStrings[0] ? moment(dateStrings[0]) : undefined,
                dateStrings[1] ? moment(dateStrings[1]) : undefined
            ]
        }
    }
    onChange = (dates, dateStrings) => {
        this.setState({
            ...this.getDates(dateStrings)
        }, () => {
                this.onSubmit()
        })
    }

    onSubmit = () => {
        const { column, confirm } = this.props
        let filters = [];
        if (this.state.dateStrings && this.state.dateStrings[0] && this.state.dateStrings[1]) {
            filters.push({
                field: column.field,
                operator: this.props.operator || 'between',
                value: [
                    moment(this.state.dateStrings[0]).startOf("days").toISOString(),
                    moment(this.state.dateStrings[1]).endOf("days").toISOString()
                ]
            })
        }
        confirm(filters)
    }
    render() {
        const { confirm, column, ...otherProps } = this.props
        return <div style={{ padding: 8 }}>
            <RangePicker
                {...otherProps}
                allowEmpty={true, true}
                allowClear={true}
                ref={ref => this.refInput = ref}
                value={this.state.dates}
                onChange={this.onChange}
                onPressEnter={this.onSubmit}
                onBlur={this.onSubmit}
                style={{ width: "256px", marginBottom: 8, }}
                autoFocus={true}
                defaultValue={[null, null]}

            />
        </div>
    }
}

export default FilterDatePicker