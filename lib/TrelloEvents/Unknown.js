module.exports = {
  Webhook: (data) => {
    let type = data.type;
    return {
      attachments: [{
        color: "danger",
        title: "Unknown event emitted from board",
        pretext: [
          `This most likely means the developers have not gotten to styling this event`,
          `The event in question was \`${type}\``,
        ].join("\n"),
      }],
    };
  },
  Channel: (channel, data) => {
    channel.send([
      "An unknown event has been emitted from your board.",
      "This most likely means the developers have not gotten to styling this event.",
      `The event in question was \`${data.type}\``,
    ]);
  },
};
