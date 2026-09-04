import ContactMessage from '../models/ContactMessage.js';

export const submitContactMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, subject, and message',
      });
    }

    const newMessage = await ContactMessage.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim(),
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out to HUMAC Medical Service. Our team will contact you shortly.',
      data: newMessage,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMessageStatus = async (req, res) => {
  try {
    const { status, replyNotes } = req.body;

    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (status) msg.status = status;
    if (replyNotes !== undefined) msg.replyNotes = replyNotes;

    await msg.save();

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: msg,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteContactMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
