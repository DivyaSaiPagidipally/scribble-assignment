export function PrivacyPage() {
  return (
    <section className="panel">
      <h1>Privacy Policy</h1>
      <p>
        When you create or join a room, the app collects player names and uses room codes.
        It also generates participant IDs and records roles and join times, along with room
        creation and update times. Room snapshots include participant details and can be
        requested using the room code. The backend stores room data in memory; restarting
        it clears the rooms.
      </p>
    </section>
  );
}
