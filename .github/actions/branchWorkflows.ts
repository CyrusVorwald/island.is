import { ActionsListWorkflowRunsForRepoResponseData } from 'detection'

export const response: ActionsListWorkflowRunsForRepoResponseData = {
  total_count: 2,
  workflow_runs: [
    {
      id: 136263499,
      node_id: 'MDExOldvcmtmbG93UnVuMTM2MjYzNDk5',
      head_branch: 'new-br',
      head_sha: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
      run_number: 43,
      event: 'pull_request',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/136263499',
      pull_requests: [
        {
          url: 'https://api.github.com/repos/andesorg/actions-tests/pulls/4',
          id: 434676053,
          number: 4,
          head: {
            ref: 'new-br',
            sha: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
            repo: {
              id: 259768089,
              url: 'https://api.github.com/repos/andesorg/actions-tests',
              name: 'actions-tests',
            },
          },
          base: {
            ref: 'main',
            sha: '64bb19bd6084bf8a4d224bb2538f955bde8ea12a',
            repo: {
              id: 259768089,
              url: 'https://api.github.com/repos/andesorg/actions-tests',
              name: 'actions-tests',
            },
          },
        },
      ],
      created_at: '2020-06-15T17:30:27Z',
      updated_at: '2020-06-16T17:57:17Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/799666344',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136263499/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
        tree_id: '198a9e9db798085de4feca41b36ffc36b509bd48',
        message: 'now ready for success',
        timestamp: '2020-06-15T17:25:00Z',
        author: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
        committer: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
    {
      id: 136259703,
      node_id: 'MDExOldvcmtmbG93UnVuMTM2MjU5NzAz',
      head_branch: 'new-br',
      head_sha: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
      run_number: 42,
      event: 'push',
      status: 'completed',
      conclusion: 'success',
      workflow_id: 1146655,
      url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703',
      html_url:
        'https://github.com/andesorg/actions-tests/actions/runs/136259703',
      pull_requests: [],
      created_at: '2020-06-15T17:25:09Z',
      updated_at: '2020-06-15T17:25:29Z',
      jobs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703/jobs',
      logs_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703/logs',
      check_suite_url:
        'https://api.github.com/repos/andesorg/actions-tests/check-suites/799646545',
      artifacts_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703/artifacts',
      cancel_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703/cancel',
      rerun_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/runs/136259703/rerun',
      workflow_url:
        'https://api.github.com/repos/andesorg/actions-tests/actions/workflows/1146655',
      head_commit: {
        id: '9998ae544a070a2f88b14d1d4fb3fa35e982a01e',
        tree_id: '198a9e9db798085de4feca41b36ffc36b509bd48',
        message: 'now ready for success',
        timestamp: '2020-06-15T17:25:00Z',
        author: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
        committer: {
          name: 'Petar Shomov',
          email: 'petar@andes.is',
        },
      },
      repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
      head_repository: {
        id: 259768089,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNTk3NjgwODk=',
        name: 'actions-tests',
        full_name: 'andesorg/actions-tests',
        private: true,
        owner: {
          login: 'andesorg',
          id: 48349113,
          node_id: 'MDEyOk9yZ2FuaXphdGlvbjQ4MzQ5MTEz',
          avatar_url: 'https://avatars3.githubusercontent.com/u/48349113?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/andesorg',
          html_url: 'https://github.com/andesorg',
          followers_url: 'https://api.github.com/users/andesorg/followers',
          following_url:
            'https://api.github.com/users/andesorg/following{/other_user}',
          gists_url: 'https://api.github.com/users/andesorg/gists{/gist_id}',
          starred_url:
            'https://api.github.com/users/andesorg/starred{/owner}{/repo}',
          subscriptions_url:
            'https://api.github.com/users/andesorg/subscriptions',
          organizations_url: 'https://api.github.com/users/andesorg/orgs',
          repos_url: 'https://api.github.com/users/andesorg/repos',
          events_url: 'https://api.github.com/users/andesorg/events{/privacy}',
          received_events_url:
            'https://api.github.com/users/andesorg/received_events',
          type: 'Organization',
          site_admin: false,
        },
        html_url: 'https://github.com/andesorg/actions-tests',
        description: null,
        fork: false,
        url: 'https://api.github.com/repos/andesorg/actions-tests',
        forks_url: 'https://api.github.com/repos/andesorg/actions-tests/forks',
        keys_url:
          'https://api.github.com/repos/andesorg/actions-tests/keys{/key_id}',
        collaborators_url:
          'https://api.github.com/repos/andesorg/actions-tests/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/andesorg/actions-tests/teams',
        hooks_url: 'https://api.github.com/repos/andesorg/actions-tests/hooks',
        issue_events_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/events{/number}',
        events_url:
          'https://api.github.com/repos/andesorg/actions-tests/events',
        assignees_url:
          'https://api.github.com/repos/andesorg/actions-tests/assignees{/user}',
        branches_url:
          'https://api.github.com/repos/andesorg/actions-tests/branches{/branch}',
        tags_url: 'https://api.github.com/repos/andesorg/actions-tests/tags',
        blobs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/blobs{/sha}',
        git_tags_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/tags{/sha}',
        git_refs_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/refs{/sha}',
        trees_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/trees{/sha}',
        statuses_url:
          'https://api.github.com/repos/andesorg/actions-tests/statuses/{sha}',
        languages_url:
          'https://api.github.com/repos/andesorg/actions-tests/languages',
        stargazers_url:
          'https://api.github.com/repos/andesorg/actions-tests/stargazers',
        contributors_url:
          'https://api.github.com/repos/andesorg/actions-tests/contributors',
        subscribers_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscribers',
        subscription_url:
          'https://api.github.com/repos/andesorg/actions-tests/subscription',
        commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/commits{/sha}',
        git_commits_url:
          'https://api.github.com/repos/andesorg/actions-tests/git/commits{/sha}',
        comments_url:
          'https://api.github.com/repos/andesorg/actions-tests/comments{/number}',
        issue_comment_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues/comments{/number}',
        contents_url:
          'https://api.github.com/repos/andesorg/actions-tests/contents/{+path}',
        compare_url:
          'https://api.github.com/repos/andesorg/actions-tests/compare/{base}...{head}',
        merges_url:
          'https://api.github.com/repos/andesorg/actions-tests/merges',
        archive_url:
          'https://api.github.com/repos/andesorg/actions-tests/{archive_format}{/ref}',
        downloads_url:
          'https://api.github.com/repos/andesorg/actions-tests/downloads',
        issues_url:
          'https://api.github.com/repos/andesorg/actions-tests/issues{/number}',
        pulls_url:
          'https://api.github.com/repos/andesorg/actions-tests/pulls{/number}',
        milestones_url:
          'https://api.github.com/repos/andesorg/actions-tests/milestones{/number}',
        notifications_url:
          'https://api.github.com/repos/andesorg/actions-tests/notifications{?since,all,participating}',
        labels_url:
          'https://api.github.com/repos/andesorg/actions-tests/labels{/name}',
        releases_url:
          'https://api.github.com/repos/andesorg/actions-tests/releases{/id}',
        deployments_url:
          'https://api.github.com/repos/andesorg/actions-tests/deployments',
      },
    },
  ],
}
