import { useState } from "react";
// import { PageShell } from "./KoiFlowShared";
import "../../style/ponds.css";

type Pond = {
  id: number;
  name: string;
  level: number;
  population: number;
  water: string;
  oxygen: string;
  image: string;
};

const initialPonds: Pond[] = [
  {
    id: 1,
    name: "Zen Garden Pond",
    level: 5,
    population: 12,
    water: "Excellent",
    oxygen: "98%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBDS20TOvTEBNCI5X1JnvHIePqKrFqxBNfB-0-i2q1lxTumWjHHK1MRLYryPaHyL0gZXAqKfkw1NwxbC6dP_KvUuJSXTNV-QxSuLGMuY5BYqxXIz4ZT1SpozxB80KVBUbtbB1A1pN21LjJd4V6kIVhFVVGvcsj3NGFzge-0cbvYlfJvtqBqEzCXHENKaCjdcY5b0zlmK-1o7UwRPNIkFlmS7bGldaWq11-77Si9FBjn-rMR00QzVtoRQQ",
  },
  {
    id: 2,
    name: "Whispering Willows",
    level: 2,
    population: 5,
    water: "Good",
    oxygen: "85%",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAbT9c_SqKD3qBXaxFd_D3zfI0Mm-wletGWnf8bmjLOpumNhpZQEU6xpAWPuqEeDMGet911wSrg2ROlKBDmyz54oCvpPuI0Kw55uqDmCG-kWZVB5aWBdR6GydhD-8EejRUrLkdYTLKZekzGQ6HzwBTe_v4m874QACNPv5hc9e9EBEZ0tEbknK0IHq875tfWXFLFAFhxxam-OivKcWCjvt82LPJ0hXijWrSlQwejbmuOg5T_XS8Zj3u10A",
  },
];

export default function Ponds() {
  const [ponds, setPonds] = useState(initialPonds);

  const createPond = () => {
    const id = Date.now();
    setPonds((current) => [
      ...current,
      {
        id,
        name: `New Zen Pond ${current.length + 1}`,
        level: 1,
        population: 0,
        water: "Good",
        oxygen: "100%",
        image: current[0].image,
      },
    ]);
  };

  return (
    // <PageShell
    //   active="ponds"
    //   title="My Ponds"
    //   subtitle="Manage and expand your serene water gardens."
    // >
    <main className="koi-page-content ponds-page">
      <div className="ponds-toolbar">
        <div>
          <span className="home-eyebrow">Pond Management</span>
          <h2>My Ponds</h2>
          <p>Manage and expand your serene water gardens.</p>
        </div>
        <button
          className="home-action-button"
          type="button"
          onClick={createPond}
        >
          ＋ Create New Pond
        </button>
      </div>

      <div className="pond-grid">
        {ponds.map((pond) => (
          <article className="pond-card" key={pond.id}>
            <div className="pond-image">
              <img src={pond.image} alt={pond.name} />
              <span className="pond-level">Level {pond.level}</span>
            </div>

            <div className="pond-card-body">
              <div className="pond-title">
                <h3>{pond.name}</h3>
                <button type="button" title="Edit pond">
                  ✏️
                </button>
              </div>

              <div className="pond-population">
                <div className="pond-icon">🐟</div>
                <div>
                  <p>Population</p>
                  <strong>{pond.population} Koi</strong>
                </div>
                <button type="button">View All</button>
              </div>

              <div className="pond-metrics">
                <div>
                  <span>Water Quality</span>
                  <strong
                    className={pond.water === "Excellent" ? "good" : "warning"}
                  >
                    ● {pond.water}
                  </strong>
                </div>
                <div>
                  <span>Oxygen Level</span>
                  <strong className="good">● {pond.oxygen}</strong>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
    // </PageShell>
  );
}
