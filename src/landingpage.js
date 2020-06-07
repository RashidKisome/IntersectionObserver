import React, { Component } from "react";
import styled, { css } from "styled-components";
import First from "./first";
import Second from "./second";
import Third from "./third";

const Horizontal = styled.div`
  display: flex;
`;

const Navigation = styled.nav`
  margin: 30px;
`;
const Article = styled.div`
  overflow-y: scroll;
  height: 100vh;
`;

const Anchor = styled.a`
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  ${props =>
    props.selected
      ? css`
          border-bottom: 1px solid #000;
          font-weight: bold;
        `
      : null};
`;

export default class LandingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: {
        id: null,
        ratio: 0
      },
      things: [
        {
          headLine: "First",
          component: <First />,
          id: "first"
        },
        {
          headLine: "Second",
          component: <Second />,
          id: "second"
        },
        {
          headLine: "Third",
          component: <Third />,
          id: "third"
        }
      ]
    };
    this.rootRef = React.createRef();
    this.singleRefs = this.state.things.reduce((acc, value) => {
      acc[value.id] = {
        ref: React.createRef(),
        id: value.id,
        ratio: 0
      };
      return acc;
    }, {});
    const callback = entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          return;
        }
        this.singleRefs[entry.target.id] = entry.intersectionRatio;
      });
      const active = Object.values(this.singleRefs).reduce((acc, current) => {
        if (current.ratio > acc.ratio) {
          return current;
        } else {
          return acc;
        }
      });
      if (active > this.state.active.ratio) {
        this.setState({
          active: active
        });
      }
    };
    const options = {
      root: null,
      rootMargin: "-30px",
      threshold: 0.5
    };

    this.observer = new IntersectionObserver(callback, options);
  }

  componentDidMount() {
    Object.values(this.singleRefs).forEach(value => {
      console.log(value.ref.current);
      return this.observer.observe(value.ref.current);
    });
  }

  articleRefHandler = () => {
    return (
      <Article ref={this.rootRef}>
        {this.state.things.map(comp => {
          return (
            <div key={comp.id} id={comp.id} ref={this.singleRefs[comp.id].ref}>
              {comp.component}
            </div>
          );
        })}
      </Article>
    );
  };

  navigationHandler = () => {
    return (
      <Horizontal>
        <Navigation>
          {this.state.things.map(comp => (
            <div key={comp.id}>
              <Anchor
                href={`#${comp.id}`}
                selected={comp.id === this.state.active.id}
              >
                {comp.headLine}
              </Anchor>
            </div>
          ))}
        </Navigation>
        {this.articleRefHandler()}
      </Horizontal>
    );
  };

  render() {
    return this.navigationHandler();
  }
}
