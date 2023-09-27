import { Popover, AutoComplete, Button, Modal, Radio, Select, Space, Tag } from 'antd';
import {
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
    EditOutlined,
    SaveTwoTone
} from '@ant-design/icons';
import axios from 'axios';
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Form, Grid, Segment, Table } from "semantic-ui-react";
import * as CONST from "../../Constants";


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
        "items": []
    };

    let initialItemData = {
        "itemId": "",
        "size": "",
        "adjustedCost": "0"
    };



    const [formData, setFormData] = useState(initialFormData);
    const [itemData, setItemData] = useState(initialItemData);
    const [orderHistory, setOrderHistory] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [totalSelling, setTotalSelling] = useState(0);
    const [totalShipping, setTotalShipping] = useState(0);
    const [totalAdjustedCost, setTotalAdjustedCost] = useState(0);

    const [dropIdOptions, setdropIdOptions] = useState([]);
    const [customerIdOptions, setCustomerIdOptions] = useState([]);
    const [itemOptions, setitemOptions] = useState([]);

    const [open, setOpen] = useState(false);
    const [isDisabledDropSelection, setisDisabledDropSelection] = useState(false);
    const [isDisabledItemCreation, setIsDisabledItemCreation] = useState(false)



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



    const handleOrderHistory = () => {
        setIsDisabledItemCreation(true);
        toast.promise(
            axios.post(`http://${CONST.BACKEND}/order/history`, {
                customerId: formData.customerId,
                dropId: formData.dropId
            }),
            {
                loading: "Loading Order History",
                success: (response) => {
                    setOrderHistory(response.data.message)
                    var totalCP = 0;
                    var totalSP = 0;
                    var totalShipping = 0;
                    var totalAdjustedCost = 0;
                    response.data.message.forEach(function (item) {
                        totalCP = totalCP + Number(item.costPrice)
                        totalSP = totalSP + Number(item.sellingPrice)
                        totalShipping = totalShipping + Number(item.shipping)
                        totalAdjustedCost = totalAdjustedCost + Number(item.adjustedCost)
                    });
                    setTotalCost(totalCP);
                    setTotalSelling(totalSP);
                    setTotalShipping(totalShipping);
                    setTotalAdjustedCost(totalAdjustedCost);
                    return (`Loaded Order History for Customer with ID: ${formData.customerId}`);
                },
                error: "Error: Could not load order history",
            }
        )
    }
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

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Space wrap>
                            <Button onClick={handleOrderHistory}>Order History</Button>
                            <Button onClick={showModal} disabled={isDisabledItemCreation}>Add Item</Button>
                            <Button type="primary" onClick={submitData} disabled={isDisabledItemCreation}>Create Order</Button>
                        </Space>
                        <Button danger onClick={() => window.location.reload()}>Reset</Button>
                    </div>
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

            {orderHistory.length > 0 && <Segment>
                <Table celled striped>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell colSpan='7' textAlign='left'>Order History</Table.HeaderCell>
                        </Table.Row>
                        <Table.Row>
                            <Table.HeaderCell textAlign='left'>Drop ID</Table.HeaderCell>
                            <Table.HeaderCell textAlign='left'>Name</Table.HeaderCell>
                            <Table.HeaderCell textAlign='center'>Image</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Size</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Status</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Tracking ID</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign='center'>Source</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body key="ohBody">
                        {orderHistory.map((item, i) => {
                            var imageUrl = `http://${CONST.HOST}:9000/${item.dropId}/${item.image}`
                            return ([
                                <Table.Row key={i}>
                                    <Table.Cell collapsing textAlign='left'>{item.dropId}</Table.Cell>
                                    <Table.Cell collapsing textAlign='left'>{item.name}</Table.Cell>
                                    <Table.Cell collapsing textAlign='center'>
                                        <Popover content={() => {
                                            return (
                                                <Table celled striped>
                                                    <Table.Header>
                                                        <Table.Row>
                                                            <Table.HeaderCell textAlign='center'>Cost Price</Table.HeaderCell>
                                                            <Table.HeaderCell textAlign='center'>Selling Price</Table.HeaderCell>
                                                            <Table.HeaderCell textAlign='center'>Shipping</Table.HeaderCell>
                                                            <Table.HeaderCell textAlign='center'>Adjusted Cost</Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Header>

                                                    <Table.Body>
                                                        <Table.Row>
                                                            <Table.Cell colSpan={1} textAlign="right">{item.costPrice}</Table.Cell>
                                                            <Table.Cell colSpan={1} textAlign="right">{item.sellingPrice}</Table.Cell>
                                                            <Table.Cell colSpan={1} textAlign="right">{item.shipping}</Table.Cell>
                                                            <Table.Cell colSpan={1} textAlign="right">{item.adjustedCost}</Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>

                                                    <Table.Footer>
                                                        <Table.Row>
                                                            <Table.HeaderCell colSpan='4' textAlign='left'>
                                                                {
                                                                    (Number(item.sellingPrice) + Number(item.shipping) + Number(item.adjustedCost) - Number(item.costPrice)) > 0
                                                                        ? <span><Tag color="green">PROFIT</Tag> <strong> {Number(item.sellingPrice) + Number(item.shipping) + Number(item.adjustedCost) - Number(item.costPrice)}</strong></span>
                                                                        : <span><Tag color="red">LOSS</Tag> <strong> {Number(item.sellingPrice) + Number(item.shipping) + Number(item.adjustedCost) - Number(item.costPrice)}</strong></span>
                                                                }
                                                            </Table.HeaderCell>
                                                        </Table.Row>
                                                    </Table.Footer>
                                                </Table>
                                            );
                                        }}>
                                            <img alt={`${item.image}`} height={'50px'} src={imageUrl} />
                                        </Popover>
                                    </Table.Cell>
                                    <Table.Cell collapsing textAlign='center'>{item.size}</Table.Cell>
                                    <Table.Cell collapsing textAlign='right'>
                                        <Space wrap>
                                            {
                                                (item.status === 'DISPATCHED')
                                                    ? <Tag icon={<CheckCircleOutlined />} color="success">DISPATCHED</Tag>
                                                    : (item.status === 'IN TRANSIT')
                                                        ? <Tag icon={<SyncOutlined spin />} color="processing">IN TRANSIT</Tag>
                                                        : <Tag icon={<ExclamationCircleOutlined />} color="error">PENDING</Tag>
                                            }
                                            <Popover
                                                trigger={'click'}
                                                content={() => {
                                                    return (
                                                        <Space direction='vertical'>
                                                            <label htmlFor="status">Status</label>
                                                            <Space wrap direction='horizontal'>
                                                                <Select
                                                                    onSelect={(val) => {
                                                                        axios.post(`http://${CONST.BACKEND}/order/update`, {
                                                                            "itemId": item.itemId,
                                                                            "size": item.size,
                                                                            "customerId": formData.customerId,

                                                                            "datapoint": "status",
                                                                            "value": val
                                                                        });
                                                                        item.status = val;
                                                                        orderHistory[i] = item;
                                                                        setOrderHistory([...orderHistory])
                                                                    }}
                                                                    id="status"
                                                                    name="status"
                                                                    placeholder="Select Status"
                                                                    options={[
                                                                        { 'label': 'PENDING', 'value': 'PENDING' },
                                                                        { 'label': 'IN TRANSIT', 'value': 'IN TRANSIT' },
                                                                        { 'label': 'DISPATCHED', 'value': 'DISPATCHED' },
                                                                    ]}
                                                                />
                                                            </Space>
                                                        </Space>
                                                    );
                                                }}
                                            >
                                                <Button shape='circle' icon={<EditOutlined />} />
                                            </Popover>
                                        </Space>
                                    </Table.Cell>

                                    <Table.Cell collapsing textAlign='right'>
                                        <Space wrap>
                                            {item.trackingId}
                                            <Popover
                                                trigger={'click'}
                                                content={() => {
                                                    return (
                                                        <Space direction='vertical'>
                                                            <label htmlFor="tracking_id">Tracking ID</label>
                                                            <Space wrap direction='horizontal'>
                                                                <Form.Input 
                                                                    placeholder="Input Tracking Id"
                                                                    onChange={(val, {value}) => {
                                                                        item.trackingId = value
                                                                    }}
                                                                />
                                                                <Button shape='circle' icon={<SaveTwoTone />} onClick={()=>{
                                                                    axios.post(`http://${CONST.BACKEND}/order/update`, {
                                                                        "itemId": item.itemId,
                                                                        "size": item.size,
                                                                        "customerId": formData.customerId,

                                                                        "datapoint": "tracking_id",
                                                                        "value": item.trackingId
                                                                    });
                                                                    orderHistory[i] = item;
                                                                    setOrderHistory([...orderHistory])
                                                                }} />                                                                
                                                            </Space>
                                                        </Space>
                                                    );
                                                }}
                                            >
                                                <Button shape='circle' icon={<EditOutlined />}  />
                                            </Popover>
                                        </Space>
                                    </Table.Cell>

                                    <Table.Cell collapsing textAlign='right'>
                                        <Space wrap>
                                            {item.source}
                                            <Popover
                                                trigger={'click'}
                                                content={() => {
                                                    return (
                                                        <Space direction='vertical'>
                                                            <label htmlFor="source">Source</label>
                                                            <Space wrap direction='horizontal'>
                                                                <Form.Input
                                                                    placeholder="Input Source"
                                                                    onChange={(val, { value }) => {
                                                                        item.source = value
                                                                    }}
                                                                />
                                                                <Button shape='circle' icon={<SaveTwoTone />} onClick={() => {
                                                                    axios.post(`http://${CONST.BACKEND}/order/update`, {
                                                                        "itemId": item.itemId,
                                                                        "size": item.size,
                                                                        "customerId": formData.customerId,

                                                                        "datapoint": "source",
                                                                        "value": item.source
                                                                    });
                                                                    orderHistory[i] = item;
                                                                    setOrderHistory([...orderHistory])
                                                                }} />
                                                            </Space>
                                                        </Space>
                                                    );
                                                }}
                                            >
                                                <Button shape='circle' icon={<EditOutlined />} />
                                            </Popover>
                                        </Space>
                                    </Table.Cell>
                                </Table.Row>
                            ])
                        })}

                        <Table.Row>
                            <Table.Cell colSpan={3} textAlign="right"> <strong>Total</strong> </Table.Cell>
                            <Table.Cell colSpan={1} textAlign="right">₹ {totalCost}         <br /><em>Cost Price</em></Table.Cell>
                            <Table.Cell colSpan={1} textAlign="right">₹ {totalSelling}      <br /><em>Selling Price</em></Table.Cell>
                            <Table.Cell colSpan={1} textAlign="right">₹ {totalShipping}     <br /><em>Shipping Cost</em></Table.Cell>
                            <Table.Cell colSpan={1} textAlign="right">₹ {totalAdjustedCost} <br /><em>Adjusted Cost</em></Table.Cell>
                        </Table.Row>

                        <Table.Row>
                            <Table.Cell colSpan={3} textAlign="right">
                                <Space wrap>
                                    {
                                        ((totalSelling + totalAdjustedCost + totalShipping) > totalCost)
                                            ? <span><Tag color="green">PROFIT of <strong>{totalSelling + totalAdjustedCost + totalShipping - totalCost}</strong></Tag></span>
                                            : <span><Tag color="red">LOSS of <strong>{totalSelling + totalAdjustedCost + totalShipping - totalCost}</strong></Tag></span>
                                    }
                                    <strong> Grand Total </strong>
                                </Space>
                            </Table.Cell>
                            <Table.Cell colSpan={1} textAlign="right"><strong>₹ {totalCost}</strong></Table.Cell>
                            <Table.Cell colSpan={3} textAlign="center"><strong>₹ {totalSelling + totalAdjustedCost + totalShipping}</strong></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Segment>}

            {formData.items.length > 0 &&
                <Segment>
                    <Table celled striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell colSpan='7' textAlign='left'>Order Summary</Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                                <Table.HeaderCell textAlign='center'>Name</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Image</Table.HeaderCell>
                                <Table.HeaderCell textAlign='center'>Size</Table.HeaderCell>
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
                                var imageUrl = `http://${CONST.HOST}:9000/${formData.dropId}/${selectedItem.image}`

                                return ([
                                    <Table.Row key={i}>
                                        <Table.Cell collapsing textAlign='left'>{selectedItem.name}</Table.Cell>
                                        <Table.Cell collapsing textAlign='center'><img alt={`${selectedItem.image}`} height={'50px'} src={imageUrl} /></Table.Cell>
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
            }
        </Grid.Column>
    );
}
