import crypto from "crypto";

export const payuClient = {
    merchantKey: process.env.PAYU_KEY || "",
    merchantSalt: process.env.PAYU_SALT || "",
    isTestMode: process.env.NODE_ENV === "development", // Use test URL in dev

    generateHash: (data: {
        txnid: string;
        amount: string;
        productinfo: string;
        firstname: string;
        email: string;
    }) => {
        const { txnid, amount, productinfo, firstname, email } = data;
        const salt = process.env.PAYU_SALT || "";

        // Debug Log
        console.log("PayU Hash Gen Params:", {
            key: process.env.PAYU_KEY ? "Present" : "Missing",
            txnid,
            amount,
            productinfo,
            firstname,
            email,
            salt: salt ? "Present" : "Missing"
        });

        // Hash sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|...|udf10|salt
        const hashString = `${process.env.PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${salt}`;

        return crypto.createHash("sha512").update(hashString).digest("hex");
    },

    verifyHash: (data: any) => {
        const {
            status,
            firstname,
            amount,
            txnid,
            productinfo,
            email,
            hash,
        } = data;

        // Response hash sequence: salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
        // Note: If udf are not used, they are empty strings.
        // However, the reverse hash is: salt|status|||||||||||email|firstname|productinfo|amount|txnid|key

        const hashString = `${process.env.PAYU_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_KEY}`;
        const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");

        return calculatedHash === hash;
    },

    getActionUrl: () => {
        // Test URL: https://test.payu.in/_payment
        // Prod URL: https://secure.payu.in/_payment
        return process.env.NODE_ENV === "development"
            ? "https://test.payu.in/_payment"
            : "https://secure.payu.in/_payment";
    }
};
