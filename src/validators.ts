import { LEAGUES, type League } from "./constants";
import { camelCase } from "change-case";

export const validateLeagues = ({ leagues }: { leagues: string[] }) => {
  const leagueValues = Object.values(LEAGUES) as readonly League[];
  console.assert(
    leagues.every((league) => leagueValues.includes(league as League)),
    `leagues must be an array of ${leagueValues.join(", ")}; got ${leagues} instead`
  );
};

export const validateStringArray = ({ strings, message }: { strings: unknown[]; message: string }) => {
  console.assert(Array.isArray(strings), message);
  console.assert(
    strings.every((string: unknown) => typeof string === "string"),
    message
  );
};

export const validateUrlParameters = ({
  validParameters,
  providedArguments,
}: {
  validParameters: Set<string>;
  providedArguments: object;
}) => {
  Object.keys(providedArguments).forEach((arg) => {
    console.assert(
      validParameters.has(arg),
      `Url parameters must be one of ${Array.from(
        Array.from(validParameters.values()).map((param) => camelCase(param))
      ).join(", ")}, got ${arg} instead`
    );
  });
};
