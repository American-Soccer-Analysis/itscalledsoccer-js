import { jest } from "@jest/globals";

import pluralize from "../src/pluralize";
import Client from "../src";
import { BASE_URL, ENTITY_TYPES, LEAGUES } from "../src/constants";
import { playersXgoalsParameters } from "../src/parameters";

// fetch payload mocks
import mockPlayersPayload from "./mocks/players-payload";
import mockManagersPayload from "./mocks/managers-payload";
import mockRefereesPayload from "./mocks/referees-payload";
import mockStadiaPayload from "./mocks/stadia-payload";
import mockTeamsPayload from "./mocks/teams-payload";

import mockPlayersXgoalsPayload from "./mocks/players-xgoals-payload";
import mockPlayersXpassPayload from "./mocks/players-xpass-payload";
import mockPlayersGoalsAddedPayload from "./mocks/players-goals-added-payload";
import mockPlayersSalariesPayload from "./mocks/players-salaries-payload";
import mockGoalkeepersXgoalsPayload from "./mocks/goalkeepers-xgoals-payload";
import mockGoalkeepersGoalsAddedPayload from "./mocks/goalkeepers-goals-added-payload";
import mockTeamsXgoalsPayload from "./mocks/teams-xgoals-payload";
import mockTeamsXpassPayload from "./mocks/teams-xpass-payload";
import mockTeamsGoalsAddedPayload from "./mocks/teams-goals-added-payload";
import mockTeamsSalariesPayload from "./mocks/teams-salaries-payload";
import mockGamesXgoalsPayload from "./mocks/games-xgoals-payload";

describe("client", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  describe("constructor", () => {
    it("instantiates with no arguments", () => {
      expect(() => {
        new Client();
      }).not.toThrow();
    });

    it("instantiates with the minimumFuseScore argument", () => {
      expect(() => {
        new Client({ minimumFuseScore: 0.75 });
      }).not.toThrow();
    });
  });

  describe("parameter validation", () => {
    it("logs to the console when an invalid league is provided", async () => {
      const mockLeague = "la liga";
      jest.spyOn(console, "assert").mockImplementation(() => {});
      jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve(new Response("[]", { status: 200 }))
      );

      const client = new Client();
      await client.getPlayersXgoals({
        leagues: [mockLeague as never],
      });

      expect(console.assert).toHaveBeenCalledWith(
        false,
        `leagues must be an array of nwsl, mls, uslc, usl1, nasl, mlsnp; got ${mockLeague} instead`
      );
    });

    it("logs to the console when an invalid url parameter is provided", async () => {
      const mockKey = "cristianRoldan";
      jest.spyOn(console, "assert").mockImplementation(() => {});
      jest.spyOn(global, "fetch").mockImplementation(() =>
        Promise.resolve(new Response("[]", { status: 200 }))
      );

      const client = new Client();
      await client.getPlayersXgoals({
        [mockKey as keyof typeof playersXgoalsParameters]: "mock value",
      });

      expect(console.assert).toHaveBeenCalledWith(
        false,
        `Url parameters must be one of ${Array.from(
          playersXgoalsParameters.values()
        ).join(", ")}, got ${mockKey} instead`
      );
    });
  });

  describe("getStats methods", () => {
    const testParameters = [
      {
        method: "getPlayersXpass" as keyof Client,
        payload: mockPlayersXpassPayload,
        urlFragment: "/players/xpass",
      },
      {
        method: "getPlayersXgoals" as keyof Client,
        payload: mockPlayersXgoalsPayload,
        urlFragment: "/players/xgoals",
      },
      {
        method: "getPlayersGoalsAdded" as keyof Client,
        payload: mockPlayersGoalsAddedPayload,
        urlFragment: "/players/goals-added",
      },
      {
        method: "getPlayersSalaries" as keyof Client,
        payload: mockPlayersSalariesPayload,
        urlFragment: "/players/salaries",
      },
      {
        method: "getGoalkeepersXgoals" as keyof Client,
        payload: mockGoalkeepersXgoalsPayload,
        urlFragment: "/goalkeepers/xgoals",
      },
      {
        method: "getGoalkeepersGoalsAdded" as keyof Client,
        payload: mockGoalkeepersGoalsAddedPayload,
        urlFragment: "/goalkeepers/goals-added",
      },
      {
        method: "getTeamsXgoals" as keyof Client,
        payload: mockTeamsXgoalsPayload,
        urlFragment: "/teams/xgoals",
      },
      {
        method: "getTeamsXpass" as keyof Client,
        payload: mockTeamsXpassPayload,
        urlFragment: "/teams/xpass",
      },
      {
        method: "getTeamsGoalsAdded" as keyof Client,
        payload: mockTeamsGoalsAddedPayload,
        urlFragment: "/teams/goals-added",
      },
      {
        method: "getTeamsSalaries" as keyof Client,
        payload: mockTeamsSalariesPayload,
        urlFragment: "/teams/salaries",
      },
      {
        method: "getGamesXgoals" as keyof Client,
        payload: mockGamesXgoalsPayload,
        urlFragment: "/games/xgoals",
      },
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it.each(testParameters)(
      "gets with no arguments",
      async ({ method, payload, urlFragment }) => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify(payload), { status: 200 }))
        );
        const client = new Client();
        const results = await client[method]();

        expect(fetch).toHaveBeenCalledTimes(Object.keys(LEAGUES).length);
        Object.values(LEAGUES).forEach((league) => {
          expect(fetch).toHaveBeenCalledWith(
            `${BASE_URL}${league}${urlFragment}`
          );
        });
        expect(results.length).toBe(
          payload.length * Object.keys(LEAGUES).length
        );
      }
    );

    it.each(testParameters)(
      "gets with leagues argument",
      async ({ method, payload, urlFragment }) => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify(payload), { status: 200 }))
        );
        const leaguesArgument = [LEAGUES.MLS, LEAGUES.NWSL];

        const client = new Client();
        const results = await client[method]({
          leagues: leaguesArgument,
        });

        expect(fetch).toHaveBeenCalledTimes(leaguesArgument.length);
        leaguesArgument.forEach((leagueArgument) => {
          expect(fetch).toHaveBeenCalledWith(
            `${BASE_URL}${leagueArgument}${urlFragment}`
          );
        });
        expect(results.length).toBe(payload.length * leaguesArgument.length);
      }
    );
  });

  describe("getEntity methods", () => {
    const testParameters = [
      {
        method: "getPlayers" as keyof Client,
        entityType: ENTITY_TYPES.PLAYER,
        payload: mockPlayersPayload,
      },
      {
        method: "getManagers" as keyof Client,
        entityType: ENTITY_TYPES.MANAGER,
        payload: mockManagersPayload,
      },
      {
        method: "getStadia" as keyof Client,
        entityType: ENTITY_TYPES.STADIUM,
        payload: mockStadiaPayload,
      },
      {
        method: "getReferees" as keyof Client,
        entityType: ENTITY_TYPES.REFEREE,
        payload: mockRefereesPayload,
      },
      {
        method: "getTeams" as keyof Client,
        entityType: ENTITY_TYPES.TEAM,
        payload: mockTeamsPayload,
      },
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it.each(testParameters)(
      "gets with no arguments",
      async ({ method, entityType, payload }) => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify(payload), { status: 200 }))
        );
        const client = new Client();
        const results = await client[method]();

        expect(fetch).toHaveBeenCalledTimes(Object.keys(LEAGUES).length);
        Object.values(LEAGUES).forEach((league) => {
          expect(fetch).toHaveBeenCalledWith(
            `${BASE_URL}${league}/${pluralize(entityType)}`
          );
        });
        expect(results.length).toBe(
          payload.length * Object.values(LEAGUES).length
        );
      }
    );

    it.each(testParameters)(
      "gets with ids",
      async ({ method, entityType, payload }) => {
        const mockIds = ["abc", "123"];
        jest.spyOn(global, "fetch").mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify(payload), { status: 200 }))
        );

        const client = new Client();
        await client[method]({ ids: mockIds });

        Object.values(LEAGUES).forEach((league) => {
          expect(fetch).toHaveBeenCalledWith(
            `${BASE_URL}${league}/${pluralize(
              entityType
            )}?${entityType}_id=${mockIds.join(",")}`
          );
        });
      }
    );
  });

  describe("getEntityByName methods", () => {
    const testParameters = [
      {
        method: "getPlayersByName" as keyof Client,
        entityType: ENTITY_TYPES.PLAYER,
        payload: mockPlayersPayload,
        mockName: "Ugo Ihemelu",
      },
      {
        method: "getManagersByName" as keyof Client,
        entityType: ENTITY_TYPES.MANAGER,
        payload: mockManagersPayload,
        mockName: "Josh Wolff",
      },
      {
        method: "getStadiaByName" as keyof Client,
        entityType: ENTITY_TYPES.STADIUM,
        payload: mockStadiaPayload,
        mockName: "PNC Stadium",
      },
      {
        method: "getRefereesByName" as keyof Client,
        entityType: ENTITY_TYPES.REFEREE,
        payload: mockRefereesPayload,
        mockName: "Alan Kelly",
      },
      {
        method: "getTeamsByName" as keyof Client,
        entityType: ENTITY_TYPES.TEAM,
        payload: mockTeamsPayload,
        mockName: "New England Revolution",
      },
    ];

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it.each(testParameters)(
      "gets names",
      async ({ method, entityType, payload, mockName }) => {
        jest.spyOn(global, "fetch").mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify(payload), { status: 200 }))
        );

        const client = new Client({ minimumFuseScore: 0.1 });
        const result = await client[method]({
          names: [mockName as never],
          leagues: ["mls"],
        });

        expect(fetch).toHaveBeenCalledWith(
          `${BASE_URL}mls/${pluralize(entityType)}`
        );
        expect(result[0][`${pluralize(entityType)}`]).toHaveLength(1);
      }
    );

    it.each(testParameters)(
      "gets no results with no names",
      async ({ method }) => {
        const client = new Client();
        const result = await client[method]();

        expect(fetch).not.toHaveBeenCalled();
        result.forEach((entry: unknown[]) => {
          expect(entry).toHaveLength(0);
        });
      }
    );
  });
});
