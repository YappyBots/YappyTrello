module.exports = {
  Webhook: (webhook, data) => {
    webhook.sendSlack({
      attachments: [{
        color: "danger",
      }],
    });
  },
  Channel: (channel, data) => {
    channel.sendMessage([
      "An unknown event has been emitted from your board.",
      "This most likely means the developers have not gotten to styling this event.",
      `The event in question was \`${data.type}\``,
    ]);
  },
};
