"use strict";
import { Divider, Input, Space, Button, Table, TableProps, Modal, Form, FormProps, DatePicker, notification, Flex } from 'antd'
import './App.css'
import { CloseOutlined, ExclamationCircleFilled, PlusOutlined, EditOutlined } from '@ant-design/icons';
import { Key, useEffect, useMemo, useState } from 'react';
import axios from "axios";
import dayjs from 'dayjs'

type ColumnTypes = Exclude<TableProps['columns'], undefined>;
type NotificationType = 'success' | 'info' | 'warning' | 'error';

type Duty = {
  id: number;
  name?: string;
  priority?: string;
  deadline?: Date;
};

function App() {
  const [form] = Form.useForm()

  const [data, setData] = useState([]);

  const [selectedRecord, setSelectedRecord] = useState<Duty | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("");

  const { Search } = Input;

  const handleSearch = (e: string) => {
    const searchParam = e.toLowerCase();
    const filteredData = data.filter((value: Duty) =>
      value?.name?.toLowerCase().includes(searchParam) ||
      value?.priority?.toLowerCase().includes(searchParam)
    )
    if(e){
      setData(filteredData);
    }else{
      getAllTodos();
    }
    handleNotification("info", "Search Success", "");
  }

  const columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (value: any, record: any) => {
        return <Flex gap="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            type="text"
          />
          {value}
        </Flex>
      }
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      render: (value: any) => {
        return dayjs(value).format('YYYY/MM/DD')
      }
    },
  ];

  /* API */
  const getAllTodos = () => {
    axios.get("http://localhost:3000/duties")
     .then(res => {
      setData(res.data)
      if(res.data && res.data.length > 0){
        handleNotification("info", "Search Success", "")
      }
    })
     .catch(err => console.error(err));
  }

  /* Create & Update Modal */
  const handleClose = () => {
    setSelectedRecord(null);
    setIsModalOpen(false);
  };

  const handleCreate = () => {
    setIsModalOpen(true);
    setModalMode("create");
  }

  const handleEdit = (record: any) => {
    setModalMode("edit");
    setSelectedRecord(record);
    console.info("record = ", record)
    setIsModalOpen(true);
  }

  const onFinish: FormProps<Duty>['onFinish'] = async (values) => {
    if(modalMode === "create") {
      await axios.post("http://localhost:3000/duties", values).then((res) => {
        if(res)
          handleNotification("success", "Create Success", "")
      })
    }else{
      await axios.patch(`http://localhost:3000/duties/${selectedRecord?.id}`, values).then((res) => {
        if(res)
          handleNotification("success", "Update Success", "")
      })
    }
    // refetch data
    getAllTodos();
    handleClose();
  };

  const onFinishFailed: FormProps<Duty>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const { confirm } = Modal;

  const handleDelete = () => {
    confirm({
      title: 'Do you confirm to delete this item?',
      icon: <ExclamationCircleFilled />,
      content: 'This action cannot be undone.',
      async onOk() {
        const body = {ids: selectedRowKeys.join()}
        await axios.delete(`http://localhost:3000/duties`, {
          data: body
        }).then((res) => {
          getAllTodos();
          if(res)
            handleNotification("success", "Delete Success", "")
        })
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    getAllTodos();
  },[])

  const [api, notificationHolder] = notification.useNotification();

  const handleNotification = (type: NotificationType, title: string, description: string) => {
    api[type]({
      message: title,
      description: description,
      placement: 'bottomLeft',
      duration: 2
    });
  };

  useEffect(() => { 
    form.setFieldsValue({
      name: selectedRecord?.name,
      priority: selectedRecord?.priority,
      deadline: selectedRecord?.deadline,
    });
  },[selectedRecord])

  return (
    <>
      {notificationHolder}
      <Modal
        title={`${modalMode && modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} To-do item`}
        open={isModalOpen && modalMode !== ""}
        onCancel={handleClose}
        footer={[
          <Button onClick={handleClose}>
              Cancel
          </Button>,
          <Button type="primary" form="duty-form" key="submit" htmlType="submit">
              Save
          </Button>
        ]}
      >
        <Form
          form={form}
          name="duty-form"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            name: selectedRecord?.name,
            priority: selectedRecord?.priority,
            deadline: selectedRecord?.deadline,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<Duty>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input duty name.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<Duty>
            label="Priority"
            name="priority"
            rules={[{ required: true, message: 'Please input the priority.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item<Duty>
            label="Deadline"
            name="deadline"
            getValueProps={(i) => ({ value: i && dayjs(i) })}
            rules={[{ required: true, message: 'Please input the deadline.' }]}
          >
            <DatePicker
              format='DD/MM/YYYY'
              placeholder='DD/MM/YYYY'
              allowClear={false}
              minDate={dayjs()}
            />
          </Form.Item>
        </Form>
      </Modal>

      <div>
        <div className="bg-white m-auto flex justify-center w-3/4">
        <Space direction="vertical" style={{ width: '100%'}}>
          <Divider orientation="left">To-do List Application</Divider>
            <Search
              placeholder="Search by Name or Priority"
              onSearch={(e) => {handleSearch(e)}}
              enterButton
            />
            <Space style={{ marginBottom: 16, display: 'flex' }}>
              <Button
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                Create
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={handleDelete}
                disabled={selectedRowKeys.length < 1}
              >
                Delete
              </Button>
            </Space>
            <Table
              columns={columns}
              dataSource={data?.map((value: Duty) => {
                return {
                  key: value.id,
                  ...value
                }
              })}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys: Key[]) => {
                  setSelectedRowKeys(selectedRowKeys);
                },
              }}/>
          </Space>
        </div>
      </div>
    </>
  )
}

export default App
