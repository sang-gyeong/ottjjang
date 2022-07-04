import {Component, Input, OnInit} from '@angular/core';

interface FeedItemDTO {
  createdAt: string;
  createdBy: string;
  imgUrl: string;
  likeCounts: number;
  title: string;
  content: string;
}

@Component({
  selector: 'app-feed-item',
  templateUrl: './feed-item.component.html',
  styleUrls: ['./feed-item.component.css'],
})
export class FeedItemComponent implements OnInit {
  @Input() feed: FeedItemDTO | null = null;

  constructor() {}

  ngOnInit(): void {}
}
