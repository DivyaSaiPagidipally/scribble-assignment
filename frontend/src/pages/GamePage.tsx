import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/Card";
import { GuessForm } from "../components/GuessForm";
import { ResultPanel } from "../components/ResultPanel";
import { RoomCodeBadge } from "../components/RoomCodeBadge";
import { Scoreboard } from "../components/Scoreboard";
import { useRoomState, useRoomStore } from "../state/roomStore";

export function GamePage() {
  const navigate = useNavigate();
  const roomStore = useRoomStore();
  const { room, participantId } = useRoomState();
  const [pollingError, setPollingError] = useState<boolean>(false);

  const roomCode = room?.code;

  useEffect(() => {
    if (!roomCode) {
      navigate("/", { replace: true });
      return;
    }

    // Fetch once on mount to handle reload or direct navigation
    roomStore.fetchRoom().catch((caughtError) => {
      if (caughtError instanceof Error && caughtError.message.includes("Unable to load room")) {
        roomStore.clearSession();
        navigate("/", { replace: true });
      }
    });

    const intervalId = setInterval(async () => {
      try {
        await roomStore.fetchRoom();
        setPollingError(false);
      } catch (caughtError) {
        if (caughtError instanceof Error && caughtError.message.includes("Unable to load room")) {
          roomStore.clearSession();
          navigate("/", { replace: true });
        } else {
          setPollingError(true);
        }
      }
    }, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [navigate, roomCode, roomStore]);

  if (!room) {
    return null;
  }

  const viewer = room.participants.find((participant) => participant.id === participantId) ?? null;

  return (
    <section className="panel game-page">
      {pollingError && (
        <div className="form__error" style={{ marginBottom: "24px" }}>
          Network connection lost. Trying to reconnect to server...
        </div>
      )}
      <div className="game-page__header">
        <div className="game-page__header-left">
          <span className="section-kicker">Round 1</span>
          <h1 className="game-page__title">Guess the Word!</h1>
        </div>
        <RoomCodeBadge code={room.code} />
      </div>

      <div className="game-page__layout">
        <aside className="game-page__sidebar game-page__sidebar--left">
          <Scoreboard />
          <ResultPanel />
        </aside>

        <div className="game-page__main">
          <Card title="Canvas">
            <div className="canvas-placeholder" style={{ minHeight: '500px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
              {viewer?.role === "drawer" ? "You are the drawer. Get ready to draw!" : "Waiting for drawer..."}
            </div>
          </Card>
        </div>

        <aside className="game-page__sidebar game-page__sidebar--right">
          <Card title="Player Info">
            <dl className="detail-list">
              <div>
                <dt>Name</dt>
                <dd>{viewer?.name ?? "Unknown player"}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>
                  <span className="card__badge" style={{ textTransform: "capitalize", padding: "2px 8px", fontSize: "0.75rem", borderRadius: "4px" }}>
                    {viewer?.role ?? "guesser"}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>Playing</dd>
              </div>
            </dl>
          </Card>

          {viewer?.role === "drawer" && room.secretWord && (
            <Card title="Secret Word">
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <span style={{ fontSize: "2rem", fontWeight: "bold", letterSpacing: "2px", color: "#3730a3", textTransform: "uppercase" }}>
                  {room.secretWord}
                </span>
                <p style={{ fontSize: "0.875rem", color: "#4b5563", marginTop: "8px" }}>
                  Draw this word on the canvas!
                </p>
              </div>
            </Card>
          )}

          {viewer?.role === "guesser" && (
            <Card title="Your Guess">
              <GuessForm />
            </Card>
          )}
        </aside>
      </div>

      <div className="button-row">
        <button className="button button--secondary" onClick={() => navigate("/lobby")}>
          Exit Game
        </button>
      </div>
    </section>
  );
}
