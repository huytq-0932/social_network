import React from 'react'
import { Input, Select, InputNumber } from 'antd';
import _ from 'lodash'
const { Option } = Select

class FilterInput extends React.Component {
    state = {
        value: _.get(this.props.column, "filteredValue[0].value"),
        operator: this.props.operator || "contains"
    }

    componentDidUpdate(prevProps) {
        if (_.get(this.props.column, "filteredValue[0].value") != _.get(prevProps.column, "filteredValue[0].value")) {
            this.setState({
                value: _.get(this.props.column, "filteredValue[0].value")
            })
        }
        if (this.visibleSearch != this.props.column.visibleSearch) {
            this.visibleSearch = this.props.column.visibleSearch
            this.refInput.input.select()
        }
    }
    onChange = (e) => {
        this.setState({ value: e.target.value })
    }

    onSubmit = () => {
        const { column, confirm } = this.props
        let filters = [];
        if (this.state.value) {
            filters.push({
                field: column.field,
                operator: this.state.operator,
                value: this.state.value
            })
        }
        confirm(filters)
    }

    renderOperator() {
        const { messages = {}, hideOperator, operator } = this.props
        
        if (hideOperator) return
        let operators = [
            { value: "contains", label: messages['contains'] || "Contains" },
            { value: "=", label: messages['equal'] || "Equals" },
            { value: "startWiths", label: messages['startWiths'] || "StartWiths" },
            { value: "endWiths", label: messages['endWiths'] || "EndWiths" },
        ]
        if (this.props.type == "number") {
            operators = [
                { value: "=", label: '=' },
                { value: ">", label: '>' },
                { value: "<", label: '<' },
                { value: ">=", label: '>=' },
                { value: "<=", label: '<=' }

            ]
        }
        const defaultOperator = operator || operators[0].value

        return <Select defaultValue={defaultOperator} style={{ width: 90 }} onChange={value => this.setState({ operator: value })}>
            {operators.map(operator => <Option value={operator.value} key={operator.value}>{operator.label}</Option>)}
        </Select>
    }

    render() {
        const { confirm, column, hideOperator, type, ...otherProps } = this.props
        let Component = Input
        //if(type == "number") Component = InputNumber
        return <div style={{ padding: 8 }}>
            <Component
                {...otherProps}
                addonBefore={this.renderOperator()}
                ref={ref => this.refInput = ref}
                value={this.state.value}
                onChange={this.onChange}
                onPressEnter={this.onSubmit}
                onBlur={this.onSubmit}
                style={{ width: "250px", marginBottom: 8, display: 'block' }}
                autoFocus={true}
            />
        </div>
    }
}

export default FilterInput