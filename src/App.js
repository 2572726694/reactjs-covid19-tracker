import { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Typography,
  FormControl,
  Select,
  MenuItem,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";
import Header from "./components/Header";
import Cards from "./components/Cards";
import Chart from "./components/Chart";

const useStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontWeight: "bold",
    marginBottom: 7,
  },
  country: {
    margin: 10,
    color: "#fff",
    fontWeight: "bold",
    borderBottom: "1px solid #eee",
  },
  charts: {
    marginTop: 50,
    width: "100%",
    padding: 10,
    border: "1px solid #e0e0e0",
    borderRadius: 10,
  },
}));

const App = () => {
  const classes = useStyles();
  const [summary, setSummary] = useState(null);
  const [countries, setCountries] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("china");
  const [countrySummary, setCountrySummary] = useState(null);
  const [countryResult, setCountryResult] = useState(null);

  const url = "https://api.covid19api.com";

  useEffect(() => {
    const getDailySummary = async () => {
      try {
        const { data } = await axios.get(`${url}/summary`);
        setSummary(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getCountries = async () => {
      try {
        const { data } = await axios.get(`${url}/countries`);
        setCountries(data);
      } catch (error) {
        console.error(error);
      }
    };

    const getSelectedCountry = async () => {
      try {
        const { data } = await axios.get(
          `${url}/total/dayone/country/${selectedCountry}`
        );
        setCountryResult(data);
        setCountrySummary({
          TotalConfirmed: data.reduce(
            (total, curr) => total + curr.Confirmed,
            0
          ),
          TotalDeaths: data.reduce((total, curr) => total + curr.Deaths, 0),
          TotalRecovered: data.reduce(
            (total, curr) => total + curr.Recovered,
            0
          ),
        });
      } catch (error) {
        console.error(error);
      }
    };

    getCountries();
    getDailySummary();
    getSelectedCountry();
  }, [selectedCountry]);

  return summary === null ? (
    <CircularProgress />
  ) : (
    <>
      <Header />

      <Container>
        <Grid container>
          <Grid item lg={3} xs={12}>
            {/* left */}
            <div style={{ marginTop: 20 }}>
              <Typography variant="h5" className={classes.title}>
                Global Overview
              </Typography>
              <Typography>
                Last Updated At: {summary.Date.substring(0, 10)}
              </Typography>
            </div>

            <Cards data={summary.Global} />
          </Grid>
          <Grid item lg={9} xs={12}>
            {/* right */}
            <FormControl style={{ maringTop: 20, color: "#fff" }}>
              <Select
                className={classes.country}
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {countries.map((item, index) => (
                  <MenuItem key={index} value={item.Slug}>
                    {item.Country}
                  </MenuItem>
                ))}
              </Select>

              <Cards data={countrySummary} country />
            </FormControl>

            <Grid container className={classes.charts} spacing={2}>
              <Grid item xs={12} md={8}>
                {/* Line */}
                <Chart line lineData={countryResult} />
              </Grid>
              <Grid item xs={12} md={4}>
                {/* Pie */}
                <Chart pieData={countrySummary} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
