import { AutoComplete, Button } from "antd";
import axios from 'axios';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Form, Grid, Segment, Table } from "semantic-ui-react";
import * as CONST from "../../Constants";

export default function Customers(params) {
    useEffect(() => {
        // get Customers
        fetch(`http://${CONST.BACKEND}/customer/list`)
            .then(response => response.json())
            .then(json => setCustomerOptions(json))
            .catch(error => console.error(error));
    }, [])



    let initialFormData = {
        "sheetId": "1qo5WVayHHOOjcG02cvXnvFl-LINb_uaDrZbI4btTnq4",
        "range": "A2:G"
    };



    const [formData, setFormData] = useState(initialFormData);
    const [customerData, setCustomerData] = useState({
        customerId: "",
        name: "",
        phone: "",
        address: "",
        email: "",
        socialId: "",
        pincode: ""
    });
    const [customerIdOptions, setCustomerIdOptions] = useState([]);



    const setCustomerOptions = (json) => {
        var options = []
        json.message.forEach((x) => {
            options.push(
                { ...x, label: x.name, value: x.name, key: x.customerId }
            )
        })
        setCustomerIdOptions(
            options
        );
    }
    const updateInputValue = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    const onSelectCustomer = (val, option) => {
        toast.promise(
            axios.get(`http://${CONST.BACKEND}/customer/${option.customerId}`),
            {
                loading: 'Loading Customer data',
                success: (response) => {
                    setCustomerData(response.data.message)
                    return (`Success! Loaded Customer data`)
                },
                error: 'Error: Could not load customer data',
            }
        );
    };



    const submitData = () => {
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/customer/import`, formData),
            {
                loading: 'Syncing Customers from Google Sheet',
                success: (response) => `Success! ${response.data.message}`,
                error: 'Error: Could not Sync',
            }
        );
        setFormData({ ...initialFormData });
    }

    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="sheetId">Sheet Id</label>
                        <Form.Input id="sheetId" value={formData.sheetId} onChange={updateInputValue} />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="range">Range</label>
                        <Form.Input id="range" value={formData.range} onChange={updateInputValue} />
                    </Form.Field>

                    <Button type="primary" onClick={submitData}>Sync from Google Sheet</Button>
                </Form>
            </Segment>

            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="customerId">Customer</label>
                        <AutoComplete
                            style={{ width: '100%' }}
                            allowClear={true}
                            onSelect={onSelectCustomer}
                            placeholder='Select a Customer'
                            options={customerIdOptions}
                            filterOption={(inputValue, option) =>
                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    </Form.Field>
                </Form>
            </Segment>

            <Segment>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='8' textAlign='left'>Customer Details</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell collapsing>ID</Table.HeaderCell>
                            <Table.HeaderCell>Name</Table.HeaderCell>
                            <Table.HeaderCell>Phone</Table.HeaderCell>
                            <Table.HeaderCell>Address</Table.HeaderCell>
                            <Table.HeaderCell>Email</Table.HeaderCell>
                            <Table.HeaderCell>Social Id</Table.HeaderCell>
                            <Table.HeaderCell>Pincode</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body key="customerDetails">
                        <Table.Row style={{ "overflowWrap": "break-word" }}>
                            <Table.Cell collapsing>{customerData.customerId}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.name}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.phone}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.address}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.email}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.socialId}</Table.Cell>
                            <Table.Cell style={{ "overflowWrap": "break-word" }}>{customerData.pincode}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Segment>
        </Grid.Column>

    );
}