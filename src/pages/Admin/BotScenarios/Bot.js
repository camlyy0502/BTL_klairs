import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, InputNumber, Row, Col, Divider } from "antd";

const { Option } = Select;

const initialScenarios = [
  {
    id: 1,
    keyword: "hello",
    response: "Xin chào!",
    responseType: "text",
    enabled: true,
  },
];

function BotScenariosPage() {
  const [scenarios, setScenarios] = useState(initialScenarios);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Thêm trạng thái bật/tắt bot và thời gian tối thiểu toàn cục
  const [botEnabled, setBotEnabled] = useState(true);
  const [globalMinReplyTime, setGlobalMinReplyTime] = useState(10);

  const showModal = (record = null) => {
    setEditing(record);
    form.setFieldsValue(record || { enabled: true, minReplyTime: globalMinReplyTime });
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editing) {
        setScenarios(scenarios.map(s => (s.id === editing.id ? { ...editing, ...values } : s)));
      } else {
        setScenarios([...scenarios, { ...values, id: Date.now() }]);
      }
      setModalVisible(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const handleDelete = id => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  const columns = [
    { title: "Keyword", dataIndex: "keyword" },
    { title: "Response", dataIndex: "response" },
    { title: "Response Type", dataIndex: "responseType" },
    { title: "Enabled", dataIndex: "enabled", render: v => (v ? "Bật" : "Tắt") },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} type="link">Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} type="link" danger>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h2>Quản lý kịch bản phản hồi Bot</h2>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <span style={{ marginRight: 8 }}>Bật/Tắt Bot:</span>
          <Switch checked={botEnabled} onChange={setBotEnabled} />
        </Col>
        <Col>
          <span style={{ marginRight: 8 }}>Thời gian chờ trả lời (Phút):</span>
          <InputNumber min={0} value={globalMinReplyTime} onChange={setGlobalMinReplyTime} />
        </Col>
      </Row>
      <Divider />
      <Button type="primary" onClick={() => showModal()}>Thêm mới kịch bản</Button>
      <Table rowKey="id" columns={columns} dataSource={scenarios} style={{ marginTop: 16 }} />
      <Modal
        title={editing ? "Chỉnh sửa kịch bản" : "Thêm mới kịch bản"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="keyword" label="Keyword" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="response" label="Response" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="responseType" label="Response Type" rules={[{ required: true }]}>
            <Select>
              <Option value="text">Text</Option>
              <Option value="image">Image</Option>
            </Select>
          </Form.Item>
          <Form.Item name="enabled" label="Bật/Tắt" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default BotScenariosPage;