import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  searchTerm: any;
  isExpanded = false;

  performSearch() {
    // perform the search using the searchTerm value
  }

}
