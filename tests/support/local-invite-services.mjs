// Local boundary replacements for SendGrid and Geocodio. No mail is delivered.
import { createServer } from "node:http";
const messages = [];
createServer(async (request, response) => {
  const url = new URL(request.url, "http://127.0.0.1");
  if (request.method === "POST" && url.pathname === "/v3/mail/send") {
    let body = "";
    for await (const chunk of request) body += chunk;
    const message = JSON.parse(body);
    messages.push(message);
    const fail = message.personalizations.some(
      (recipient) =>
        recipient.dynamic_template_data?.account_confirmation_url &&
        recipient.to.some((to) => to.email.startsWith("mailfailure+")),
    );
    response.writeHead(fail ? 503 : 202, {
      "Content-Type": "application/json",
    });
    response.end(
      JSON.stringify(
        fail ? { errors: [{ message: "Simulated mail outage" }] } : {},
      ),
    );
    return;
  }
  response.setHeader("Content-Type", "application/json");
  if (url.pathname === "/v1.7/geocode") {
    const components = {
      city: "Boulder",
      state: "CO",
      zip: "80302",
      county: "Boulder County",
      country: "US",
    };
    response.end(
      JSON.stringify({
        input: {
          address_components: components,
          formatted_address: "1777 Broadway, Boulder, CO 80302",
        },
        results: [
          {
            address_components: components,
            formatted_address: "1777 Broadway, Boulder, CO 80302",
            location: { lat: 40.015, lng: -105.2705 },
            accuracy: 1,
            accuracy_type: "rooftop",
            source: "local test fixture",
            fields: {
              congressional_districts: [],
              state_legislative_districts: { house: [], senate: [] },
            },
          },
        ],
      }),
    );
    return;
  }
  if (url.pathname === "/messages") {
    response.end(JSON.stringify(messages));
    return;
  }
  response.writeHead(404);
  response.end("{}");
}).listen(55440, "127.0.0.1", () =>
  console.log("Local invite services listening on 127.0.0.1:55440"),
);
