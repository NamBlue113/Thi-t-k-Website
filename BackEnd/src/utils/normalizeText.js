const normalizeText = (text = "") => {

    return text
        .toLowerCase()
        .trim()
        .replace(/[.,!?;:]/g, "")
        .replace(/\s+/g, " ");
};

module.exports = normalizeText;