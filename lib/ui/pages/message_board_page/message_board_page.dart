import 'package:flutter/material.dart';

class MessageBoardPage extends StatelessWidget {
  const MessageBoardPage({super.key});

  @override
  Widget build(BuildContext context) {
    // Sample placeholder posts
    final posts = List.generate(10, (i) => _Post(
      author: 'User${i + 1}',
      time: '${DateTime.now().hour}:${(DateTime.now().minute + i) % 60}'.padLeft(2, '0'),
      snippet: 'This is a preview of post #${i + 1}. Click to read more…',
    ));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Message Board'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: posts.length,
              separatorBuilder: (_, __) => const Divider(),
              itemBuilder: (context, index) {
                final post = posts[index];
                return ListTile(
                  leading: CircleAvatar(
                    child: Text(post.author[0]),
                  ),
                  title: Text(post.author),
                  subtitle: Text(post.snippet),
                  trailing: Text(post.time,
                      style: Theme.of(context).textTheme.bodySmall),
                  onTap: () {
                    // TODO: navigate to post details
                  },
                );
              },
            ),
          ),
          const Divider(height: 1),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    decoration: InputDecoration(
                      hintText: 'Write a new message…',
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 8),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: () {
                    // TODO: post new message
                  },
                  child: const Text('Post'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Post {
  final String author;
  final String time;
  final String snippet;
  _Post({
    required this.author,
    required this.time,
    required this.snippet,
  });
}