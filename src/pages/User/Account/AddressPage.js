import React, { useState } from 'react';
import AddressManager from '../Account/AddressManager';

function AddressPage() {
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    return (
        <div className="container mt-4">
            <h2>Quản lý địa chỉ giao hàng</h2>
            <AddressManager selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
        </div>
    );
}

export default AddressPage;
