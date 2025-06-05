import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Select, Switch, InputNumber, Row, Col } from "antd";
import { SettingOutlined } from '@ant-design/icons';

import BotScenariosApi from '../../../Api/Admin/BotScenarios';
import { toast } from "react-toastify";
import { data } from "react-router-dom";


const { Option } = Select;


function BotScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);  
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [botEnabled, setBotEnabled] = useState(true);
  const [globalMinReplyTime, setGlobalMinReplyTime] = useState(10);
  const [tempReplyTime, setTempReplyTime] = useState(globalMinReplyTime);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const filteredScenarios = scenarios.filter(scenario => {
    const searchLower = searchText.toLowerCase();
    return searchText === '' ? true : (
      scenario.keyword?.toLowerCase().includes(searchLower) ||
      scenario.response?.toLowerCase().includes(searchLower)
    );
  });

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const res = await BotScenariosApi.listBotScenarios();
        setScenarios(res);
      } catch (e) {
        setScenarios([]);
      }
    }
    fetchScenarios();
  }, []);

  const showModal = (record = null) => {
    setEditing(record);
    form.setFieldsValue(record || { 
      enabled: true, 
      minReplyTime: globalMinReplyTime,
      response_type: 'TEXT' // Set default value
    });
    setModalVisible(true);
  };

  const handleCancel = () => {
    form.resetFields();
    setEditing(null);
    setModalVisible(false);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        try {
        // Cập nhật kịch bản
        await BotScenariosApi.updateBotScenario(editing.id, values);
        toast.success('Cập nhật kịch bản thành công');
        } catch (error) {
          toast.error('Cập nhật kịch bản thất bại');
        }
      } else {
        try {
        // Tạo kịch bản mới
          await BotScenariosApi.createBotScenarios(values);
          toast.success('Thêm kịch bản thành công');
        } catch (error) {
          toast.error('Tạo kịch bản thất bại');
        }
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

  const handleBotEnabledChange = async () => {
    try {
      await BotScenariosApi.changeStatusBotScenario();
    } catch (error) {
      toast.error('Cập nhật trạng thái bot thất bại');
    } finally {
      try {
        const status = await BotScenariosApi.getStatusBotScenario();
        const enabled = status.data ?? status;
        setBotEnabled(enabled);
        toast.success(enabled ? 'Đã bật bot thành công' : 'Đã tắt bot thành công');
      } catch (e) {
        // fallback: không cập nhật UI nếu lỗi
      }
    }
  };

  const handleSettingsOpen = async () => {
    try {
      const [status, time] = await Promise.all([
        BotScenariosApi.getStatusBotScenario(),
        BotScenariosApi.getBotTimeScenario()
      ]);
      setBotEnabled(status.data ?? status); // .data nếu API trả về {data: true/false}, fallback nếu trả về boolean
      setGlobalMinReplyTime(time / 60);
      setTempReplyTime(time / 60);
    } catch (e) {
      setBotEnabled(true);
      setGlobalMinReplyTime(10);
      setTempReplyTime(10);
    }
    setSettingsVisible(true);
  };

  const handleSettingsOk = async () => {
    try {
      console.log('Updating reply time:', tempReplyTime);
      await BotScenariosApi.setBotTimeScenario({ time: tempReplyTime * 60 });
      toast.success('Cập nhật thời gian chờ trả lời thành công');
    } catch (error) {
      toast.error('Cập nhật thời gian chờ trả lời thất bại');
    } finally {
      try {
        const time = await BotScenariosApi.getBotTimeScenario();
        setGlobalMinReplyTime(time / 60);
      } catch (e) {
        // fallback: không cập nhật UI nếu lỗi
      }
      setSettingsVisible(false);
    }
  };

  const columns = [
    { title: "Từ khóa", dataIndex: "keyword" },
    { title: "Câu trả lời", dataIndex: "response" },
    { title: "Kiểu trả lời", dataIndex: "response_type" },
    {
      title: "Thao tác",
      render: (_, record) => (
        <>
          <Button onClick={() => showModal(record)} type="link">Sửa</Button>
          <Button onClick={() => handleDelete(record.id)} type="link" danger>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">
              <h4>
                Quản lý kịch bản phản hồi Bot
                <Button 
                  type="primary" 
                  className="float-end" 
                  onClick={() => showModal()}
                >
                  Thêm mới kịch bản
                </Button>
                <Button
                  icon={<SettingOutlined />}
                  style={{ float: 'right', marginRight: 10 }}
                  onClick={handleSettingsOpen}
                  title="Cài đặt bot"
                />
                <Input.Search
                  placeholder="Tìm kiếm theo từ khóa hoặc câu trả lời..."
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  style={{ width: '300px', float: 'right', marginRight: '10px' }}
                  allowClear
                />
              </h4>
            </div>
            <div className="card-body">
              <Table 
                rowKey="id" 
                columns={columns} 
                dataSource={filteredScenarios}
                className="table table-bordered"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal form */}
      <Modal
        title={editing ? "Chỉnh sửa kịch bản" : "Thêm mới kịch bản"}
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="keyword" label="Từ khóa" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="response" label="Câu trả lời" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="response_type" label="Loại câu trả lời" rules={[{ required: true }]}>
            <Select>
              <Option value="TEXT">Văn bản</Option>
              <Option value="PRODUCT_LIST">Danh sách sản phẩm</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Settings Modal */}
      <Modal
        title="Cài đặt Bot"
        open={settingsVisible}
        onOk={handleSettingsOk}
        onCancel={() => setSettingsVisible(false)}
        destroyOnClose
      >
        <Row gutter={16} className="mb-3">
          <Col span={24} style={{ marginBottom: 16 }}>
            <span className="me-2">Tắt/Bật Bot:</span>
            <Switch checked={botEnabled} onChange={handleBotEnabledChange} />
          </Col>
          <Col span={24}>
            <span className="me-2">Thời gian chờ trả lời (Phút):</span>
            <InputNumber 
              min={1} 
              value={tempReplyTime} 
              onChange={setTempReplyTime} 
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

export default BotScenariosPage;