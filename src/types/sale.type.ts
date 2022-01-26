// sale.type.ts
// -----------------------------------------------------------

export interface ISale {
    _id: string,
    pub_id: string,
    usr_id: string,
    sale_delivery_date:  Date,
    sale_purchase_date: Date,
    sale_invoice_amount: number
}

// -----------------------------------------------------------
