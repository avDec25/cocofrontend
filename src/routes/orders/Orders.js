import React from "react";
import { useState, useEffect } from "react";
import { Table, Segment, Form, Grid } from "semantic-ui-react";
import { Button, Modal, Select, Space, Radio, AutoComplete } from 'antd';
import * as CONST from "../../Constants";
import axios from 'axios';
import toast from "react-hot-toast";


const sizeOptions = [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' },
    { label: 'XXL', value: 'XXL' },
];

export default function Orders(params) {
    useEffect(() => {
        // get Drop IDs
        fetch(`http://${CONST.BACKEND}/drop/list/id`)
            .then(response => response.json())
            .then(json => setDropOptions(json))
            .catch(error => console.error(error));

        // get Customers
        fetch(`http://${CONST.BACKEND}/customer/list`)
            .then(response => response.json())
            .then(json => setCustomerOptions(json))
            .catch(error => console.error(error));
    }, []);

    let initialFormData = {
        "dropId": "",
        "customerId": "",
        "items": [
            // { "itemId": "", "size": "", "adjustedCost": "" }
        ]
    };

    let initialItemData = {
        "itemId": "",
        "size": "",
        "adjustedCost": ""
    };



    const [formData, setFormData] = useState(initialFormData);
    const [itemData, setItemData] = useState(initialItemData);

    const [dropIdOptions, setdropIdOptions] = useState([]);
    const [customerIdOptions, setCustomerIdOptions] = useState([]);
    const [itemOptions, setitemOptions] = useState([]);

    const [open, setOpen] = useState(false);
    const [isDisabledDropSelection, setisDisabledDropSelection] = useState(false);



    const showModal = () => {
        setOpen(true);
    };
    const closeModal = () => {
        setOpen(false);
    };



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
    const setDropOptions = (json) => {
        var options = []
        json.message.split(',').forEach((x) => {
            options.push(
                { 'label': x, 'value': x }
            )
        })
        setdropIdOptions(
            options
        );
    }
    const prepareAndSetItemOptions = (json) => {
        var options = []
        json.message.forEach((x) => {
            options.push(
                { ...x, 'label': x.name, 'value': x.itemId }
            )
        })
        setitemOptions(
            options
        );
    }



    const updateDropId = (e, val) => {
        setFormData({ ...formData, 'dropId': val });

        // update itemOptions
        fetch(`http://${CONST.BACKEND}/item/list?dropId=${val}`)
            .then(response => response.json())
            .then(json => prepareAndSetItemOptions(json))
            .catch(error => console.error(error))
        setisDisabledDropSelection(true);
    }
    const updateItemId = (e, val) => {
        setItemData({ ...itemData, 'itemId': val });
    }
    const updateItemData = (e) => {
        setItemData({ ...itemData, [e.target.id]: e.target.value })
    }
    const updateItemSize = ({ target: { value } }) => {
        setItemData({ ...itemData, size: value })
    };
    const onSelectCustomer = (val, option) => {
        setFormData({ ...formData, customerId: option.customerId })
    };


    const submitData = () => {
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/order/create`, formData),
            {
                loading: 'Creating Order',
                success: (response) => `Success! ${response.data.message}`,
                error: 'Error: Could not create order',
            }
        );
    }



    return (
        <Grid.Column>
            <Segment>
                <Form>
                    <Form.Field>
                        <label htmlFor="customerId">Customer</label>
                        <AutoComplete
                            style={{ width: '100%' }}
                            onSelect={onSelectCustomer}
                            placeholder='Select a Customer'
                            options={customerIdOptions}
                            filterOption={(inputValue, option) =>
                                option.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                            }
                        />
                    </Form.Field>

                    <Form.Field>
                        <label htmlFor="dropId">Drop Id</label>
                        <Select
                            disabled={isDisabledDropSelection}
                            id="dropId"
                            placeholder='Select a Drop Id'
                            style={{ width: '100%' }}
                            options={dropIdOptions}
                            onChange={(e, { value }) => updateDropId(e, value?.toString())}
                        />
                    </Form.Field>

                    <Space wrap>
                        <Button onClick={showModal}>Add Item</Button>
                        <Button type="primary" onClick={submitData}>Create Order</Button>
                    </Space>
                </Form>

                <Modal
                    title="Add Item to Customer Cart"
                    open={open}
                    onOk={() => {
                        formData.items.push(itemData);
                        closeModal();
                    }}
                    confirmLoading={false}
                    onCancel={() => {
                        closeModal();
                    }}
                >
                    <Form>
                        <Form.Field>
                            <label htmlFor="itemId">Item</label>
                            <Select
                                id="itemId"
                                placeholder='Select an Item'
                                style={{ width: '100%' }}
                                options={itemOptions}
                                onChange={(e, { value }) => updateItemId(e, value?.toString())}
                            />
                        </Form.Field>

                        <Form.Field>
                            <label htmlFor="size">Size</label>
                            <Radio.Group
                                name="size"
                                options={sizeOptions}
                                onChange={updateItemSize}
                                optionType="button"
                                buttonStyle="solid"
                            />
                        </Form.Field>

                        <Form.Field>
                            <label htmlFor="adjustedCost">Adjusted Cost</label>
                            <Form.Input id="adjustedCost" onChange={updateItemData} />
                        </Form.Field>
                    </Form>
                </Modal>
            </Segment>

            <Segment>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='6' textAlign='left'>Order Summary</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell textAlign='center'>Name</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Size</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Cost Price</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Selling Price</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Shipping</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Adjusted Cost</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body key="osBody">
                        {formData.items.map((item, i) => {
                            var selectedItem = {}
                            itemOptions.forEach((element) => {
                                if (element.itemId === item.itemId) {
                                    selectedItem = element;
                                    return;
                                }
                            });
                            return ([
                                <Table.Row key={i}>
                                    <Table.Cell collapsing textAlign='left'>{selectedItem.name}</Table.Cell>
                                    <Table.Cell collapsing textAlign='center'>{item.size}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>{selectedItem.costPrice}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>{selectedItem.sellingPrice}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>{selectedItem.shipping}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>{item.adjustedCost}</Table.Cell>
                                </Table.Row>
                            ])
                        })}


                    </Table.Body>
                </Table>
            </Segment>
        </Grid.Column>
    );
}
