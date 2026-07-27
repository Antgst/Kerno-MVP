const requestsService = require("./requests.service");

function getRequestsModuleStatus(req, res) {
  const message = requestsService.getStatus();

  res.status(200).json({
    success: true,
    module: "requests",
    message,
  });
}

async function createContactRequest(req, res, next) {
  try {
    const request = await requestsService.createContactRequest(
      req.user.id,
      req.body,
    );

    res.status(201).json({
      success: true,
      message: "Contact request created successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
}

async function getSentRequests(req, res, next) {
  try {
    const requests = await requestsService.getSentRequests(req.user.id);

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

async function getReceivedRequests(req, res, next) {
  try {
    const requests = await requestsService.getReceivedRequests(req.user.id);

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    next(error);
  }
}

async function getRequestById(req, res, next) {
  try {
    const request = await requestsService.getRequestById(
      req.user.id,
      req.user.role,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    next(error);
  }
}

async function updateRequestStatus(req, res, next) {
  try {
    const request = await requestsService.updateRequestStatus(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Contact request status updated successfully",
      request,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getRequestsModuleStatus,
  createContactRequest,
  getSentRequests,
  getReceivedRequests,
  getRequestById,
  updateRequestStatus,
};
