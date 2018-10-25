# Notes on publish process

```
# clone project to local
cd ~/OpenSourceProjects
git clone https://github.com/thebarty/analytics-js-without-segment.git
cd analytics-js-without-segment

# ... edit changes

# push to github
git add .
git commit -m "message"
git push -all

# publish to npm
npm run publish-to-npm;  # build and publish to npm
```
