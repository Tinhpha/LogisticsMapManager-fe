import React, { useState } from 'react';
import './AddLocationForm.css';

interface AddLocationFormProps {
  onClose: () => void;
  onSubmit: (locationData: any) => void;
}

const AddLocationForm: React.FC<AddLocationFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    address: '',
    business_type: '',
    phone_number: '',
    latitude: '',
    longitude: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Thêm Địa Điểm Mới</h2>
        </div>
        <div className="modal-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Nhập địa chỉ..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="business_type">Loại hình</label>
              <input
                type="text"
                id="business_type"
                name="business_type"
                value={formData.business_type}
                onChange={handleChange}
                required
                placeholder="Nhập loại hình..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone_number">Số điện thoại</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                placeholder="Nhập số điện thoại..."
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="latitude">Vĩ độ</label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="any"
                  required
                  placeholder="Nhập vĩ độ..."
                />
              </div>

              <div className="form-group half">
                <label htmlFor="longitude">Kinh độ</label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="any"
                  required
                  placeholder="Nhập kinh độ..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-btn">
                Hủy
              </button>
              <button type="submit" className="submit-btn">
                Gửi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLocationForm;
