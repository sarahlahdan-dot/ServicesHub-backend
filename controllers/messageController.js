const Message = require('../models/Message');
const User = require('../models/User');

const getTargetUser = async (userId) => {
  const user = await User.findById(userId).select('_id name email role');

  if (!user) {
    return { error: { status: 404, message: 'User not found.' } };
  }

  return { user };
};

const ensureUserCanMessage = (currentUser, targetUserId) => {
  const currentUserId = String(currentUser.id);

  if (currentUserId === String(targetUserId)) {
    return { error: { status: 400, message: 'You cannot send a message to yourself.' } };
  }

  return { currentUserId };
};

const listInbox = async (req, res) => {
  try {
    const currentUserId = String(req.user.id || req.user._id);

    const messages = await Message.find({
      $or: [{ senderId: currentUserId }, { receiverId: currentUserId }],
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: -1 });

    const conversations = [];
    const seenUserIds = new Set();

    messages.forEach((message) => {
      const counterpart = String(message.senderId?._id) === currentUserId
        ? message.receiverId
        : message.senderId;

      if (!counterpart?._id) {
        return;
      }

      const counterpartId = String(counterpart._id);
      if (seenUserIds.has(counterpartId)) {
        return;
      }

      seenUserIds.add(counterpartId);
      conversations.push({
        user: counterpart,
        latestMessage: message,
      });
    });

    return res.json({ conversations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listUserMessages = async (req, res) => {
  try {
    const targetUserResult = await getTargetUser(req.params.userId);
    if (targetUserResult.error) {
      return res.status(targetUserResult.error.status).json({ message: targetUserResult.error.message });
    }

    const permissionResult = ensureUserCanMessage(req.user, req.params.userId);
    if (permissionResult.error) {
      return res.status(permissionResult.error.status).json({ message: permissionResult.error.message });
    }

    const messages = await Message.find({
      $or: [
        { senderId: permissionResult.currentUserId, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: permissionResult.currentUserId },
      ],
    })
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role')
      .sort({ createdAt: 1 });

    return res.json({ userId: req.params.userId, messages });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendUserMessage = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: 'Message content is required.' });
    }

    const targetUserResult = await getTargetUser(req.params.userId);
    if (targetUserResult.error) {
      return res.status(targetUserResult.error.status).json({ message: targetUserResult.error.message });
    }

    const permissionResult = ensureUserCanMessage(req.user, req.params.userId);
    if (permissionResult.error) {
      return res.status(permissionResult.error.status).json({ message: permissionResult.error.message });
    }

    const message = await Message.create({
      senderId: permissionResult.currentUserId,
      receiverId: req.params.userId,
      content: String(content).trim(),
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('senderId', 'name email role')
      .populate('receiverId', 'name email role');

    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listInbox,
  listUserMessages,
  sendUserMessage,
};
