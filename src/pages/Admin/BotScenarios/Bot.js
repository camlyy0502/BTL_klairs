import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, InputNumber, Row, Col, Divider } from "antd";

import BotScenariosApi from '../../../Api/Admin/BotScenarios';


const { Option } = Select;


function BotScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Thêm trạng thái bật/tắt bot và thời gian tối thiểu toàn cục
  const [botEnabled, setBotEnabled] = useState(true);
  const [globalMinReplyTime, setGlobalMinReplyTime] = useState(10);

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const res = await BotScenariosApi.listBotScenarios();
        setScenarios(res);
      } catch (e) {
        setScenarios([]); // fallback nếu lỗi
      }
    }
    fetchScenarios();
  }, []);

  const showModal = (record = null) => {
    setEditing(record);
    form.setFieldsValue(record || { enabled: true, minReplyTime: globalMinReplyTime });
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        // Cập nhật kịch bản
        await BotScenariosApi.updateBotScenario(editing.id, values);
      } else {
        // Tạo kịch bản mới
        await BotScenariosApi.createBotScenarios(values);
      }
      // Sau khi thêm/sửa thành công, gọi lại API lấy danh sách mới
      const updatedList = await BotScenariosApi.listBotScenarios();
      setScenarios(updatedList);
      
      setModalVisible(false);
      setEditing(null);
      form.resetFields();
    } catch (error) {
      Modal.error({
        title: editing ? 'Lỗi cập nhật kịch bản' : 'Lỗi tạo kịch bản',
        content: 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await BotScenariosApi.deleteBotScenario(id);
      setScenarios(scenarios.filter(s => s.id !== id));
    } catch (error) {
      Modal.error({
        title: 'Lỗi xóa kịch bản',
        content: 'Đã có lỗi xảy ra. Vui lòng thử lại.'
      });
    }
  };

  useEffect(() => {
    const updateBotConfig = async () => {
      try {
        await BotScenariosApi.updateBotConfig({
          enabled: botEnabled,
          globalMinReplyTime
        });
      } catch (error) {
        Modal.error({
          title: 'Lỗi cập nhật cấu hình',
          content: 'Không thể cập nhật cấu hình bot. Vui lòng thử lại.'
        });
      }
    };

    updateBotConfig();
  }, [botEnabled, globalMinReplyTime]);

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
          <Form.Item name="response_type" label="Response Type" rules={[{ required: true }]}>
            <Select>
              <Option value="TEXT">Text</Option>
              <Option value="PRODUCT_LIST">List Product</Option>
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